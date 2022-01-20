import { 
    Resolver,  
    Arg, 
    Ctx,
    Mutation, 
    Query,
    Field, 
    ObjectType,
    UseMiddleware
} from "type-graphql";
import argon2 from "argon2";
import { AppContext } from "../../shared-resources/utils/app.context";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { AdminRoute } from "../../middleware/AdminRoute";

// entity imports
import { 
    Customer,
    CustomerModel, 
    Business, 
    Admin
} from "../../entities/Users";
import { RouteModel } from "../../entities/Route";

// helper function imports
import { 
    createAccessToken, 
    configCookie, 
    tokenIdentifier
} from "../../shared-resources/utils/jwt.strategy"; 
import { genResetToken } from "../../shared-resources/utils/tokens.strategy";
import { sendEmail } from "../../shared-resources/utils/mailer";

// input type imports
import { 
    RegisterInput,
    LoginInput
} from "./users.input";

// response imports
import { 
    AuthResponse,
    Self,
    RedeemedPromotionResponse,
    IntResponse,
    ProfileResponse
} from "./users.response";

// local constant imports
import { 
    notAllowedMsg, 
    UserType,
    taken,
    invalidCredentialsMsg,
    resetTokenExpiry
} from "./users.constants";

/**
 * @description
 * Factory for creating register
 * and login resolvers given a
 * user type.
 * 
 * @param suffix: the user type used to create register
 *                mutations of the form: register[suffix] 
 * @param schema: the schema entity used to for the 
 *                mutation
 * @returns The users token or error
 * 
 */
function createAuthResolver(
    suffix: string,
    schema: any
) {
    @Resolver()
    class BaseResolver {

       /**
        * @description
        * Register Resolver Factory
        * Mutation to register a user for the platform
        * 
        * @param data: user registration inputs 
        * @param res: the express response object from context 
        * @returns the login token or an array of error strings
        */
        @Mutation(() => AuthResponse, {name: `register${suffix}`})
        async register(
            @Arg("data", () => RegisterInput) data: RegisterInput,
            @Ctx() { res }: AppContext,
        ): Promise<AuthResponse> {
           
            // admins cant register
            if (suffix === UserType.ADMIN) {
                return {
                    errors: [{
                            message: notAllowedMsg
                        }]
                }
            }
            
            try {

                // make sure usernames are unique across user types
                const candidateUsername = data.username;
                let isTaken = await Admin.findOne({ username: candidateUsername });

                if (isTaken) throw new Error("Already registered");

                if (suffix !== UserType.BUSINESS)
                    isTaken = await Business.findOne({ username: candidateUsername });
                
                if (suffix !== UserType.CUSTOMER)
                    isTaken = await Customer.findOne({ username: candidateUsername });

                if (isTaken) throw new Error("Already registered");

                // else continue with registration attempt
                data.password = await argon2.hash(data.password);
                const user = await (await schema.create(data)).save();

                const token = await createAccessToken(user._id, user.username, suffix);
                const {name, val, options} = configCookie(token);
                res.cookie(name, val, options);

                return { token };
            } catch (err) {
                console.log(err);
                return {
                    errors: [{
                        message: taken
                    }]
                }
            }
        }   
    }

    return BaseResolver;
}

// use factory to create register mutations
// for each user type 
export const CustomerResolver = createAuthResolver(
    UserType.CUSTOMER, 
    Customer
);


export const BusinessResolver = createAuthResolver(
    UserType.BUSINESS, 
    Business
);


export const AdminResolver = createAuthResolver(
    UserType.ADMIN, 
    Admin
);


// resolver for pulling user
// info based on auth token
@Resolver()
export class UserResolver {

    /**
     * @description
     * @angus
     * 
     * @param credentials: @angus
     * @param res: @angus
     * @returns @angus
     */
    @Mutation(() => AuthResponse)
    async login (
       @Arg("credentials") credentials: LoginInput,
       @Ctx() { res }: AppContext,
    ): Promise<AuthResponse> {
       const { username, password } = credentials;

        let user;
        // assume admin initially
        let userType = UserType.ADMIN;

        // check if admin first for speed
        user = await Admin.findOne({ username });

        if (!user) {
            user = await Customer.findOne({ username });
            if (user) userType = UserType.CUSTOMER;
        }
        
        if (!user) {
            user = await Business.findOne({ username });
            if (user) userType = UserType.BUSINESS;
        }

        // if still no user is found, bad credentials
        if (!user) {
            return {
                errors: [{
                    message: invalidCredentialsMsg
                }]
            }
        }

        // validate credentials
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{
                    message: invalidCredentialsMsg
                }]
            }
        }

        const token = await createAccessToken(user._id, user.username, userType);
        const {name, val, options} = configCookie(token);
        res.cookie(name, val, options);

        return { token, userType };
    }    


    /**
     * @description
     * return information about
     * a user based on their 
     * JWT.
     * 
     * @param jwtPayload: the user's JWT token
     * @returns the userID, name and type from the token
     */
    @UseMiddleware(Authorised)
    @Query(() => Self)
    async getSelf(
        @Ctx() { jwtPayload }: AppContext,
    ): Promise<Self> {
        const { userID, username, userType } = jwtPayload!;
        return {
            userID,
            username,
            userType
        }
    }

    /**
     * @description
     * return information about a customer or
     * businesses profile
     * 
     * @param jwtPayload: the user's JWT token
     * @returns customer or business profile information 
     *          on success
     */
    @UseMiddleware(Authorised)
    @Query(() => ProfileResponse)
    async getProfile(
        @Ctx() { jwtPayload }: AppContext
    ) {
        const { userID, userType } = jwtPayload!;

        // get the customer while populating the venue references in promotions
        const customer = await Customer.findById(userID).populate([
            'redeemedPromotions.venue',
            'myRoutes',
            'sharedRoutes'
        ]);

        // if they don't exist see if they
        // are a business
        if (!customer) {
            const business = await Business.findById(userID);
            if (!business) return;
            
            const { username, email, createdAt } = business;
            return {
                username: username,
                userType: userType,
                email: email,
                joinedDate: createdAt
            }
        }

        let future: RedeemedPromotionResponse[] = []
        let active: RedeemedPromotionResponse[] = []
        let expired: RedeemedPromotionResponse[] = []

        // check if the customer has any redeemed promotions
        if (customer.redeemedPromotions.length > 0) {

            // find all the promotions that are expired, upcoming and valid
            // set todays date to compare with (at midnight due to promotions not storing times)
            const today: Date = new Date(new Date().setHours(0,0,0,0))

            // now find the promotions for each category
            // const future = customer.redeemedPromotions.find({ startDate: { $gt: today } });

            for (var promotion of customer.redeemedPromotions) {

                // pull out the data from promotion
                let {_id, creditsRequired, startDate, endDate, percentageOff, venue} = promotion;
                
                // todo: better error returns here and below
                if (!venue) return

                // if venue is still a reference and not an object, then return
                if (typeof venue === 'string') 
                    return
                
                // Create a correctly formatted subdoc for Redeemed Promotion Response
                let subdoc = {
                    _id: _id,
                    creditsRequired: creditsRequired,
                    startDate: startDate,
                    endDate: endDate,
                    percentageOff: percentageOff,
                    venue: venue
                }

                // is it future?
                if (startDate > today) {
                    future.push(subdoc)
                } else if (endDate < today) {
                    // is it expired?
                    expired.push(subdoc)
                } else {
                    // else active
                    active.push(subdoc)
                }
 
            }

        }
        
        // return the correct data
        const customerData = {
            username: customer.username,
            id: customer._id,
            userType: userType,
            email: customer.email,
            credits: customer.credits,
            activePromotions: active,
            futurePromotions: future,
            expiredPromotions: expired,
            myRoutes: customer.myRoutes,
            sharedRoutes: customer.sharedRoutes,
            joinedDate: customer.createdAt
        }

        return customerData
    }


    /**
     * @description
     * log a user out of the platform by
     * clearing the user's cookie
     * 
     * @param res: express response object
     * @returns true upon success
     */
    @UseMiddleware(Authorised)
    @Query(() => Boolean)
    async logout(
        @Ctx() { res }: AppContext,
    ): Promise<boolean> {
        res.clearCookie(tokenIdentifier);
        return true;
    }
    
    /**
     * @description
     * generate a password reset token for the user
     * 
     * @param email: the user's email 
     * @returns true on success 
     */    
    @Query(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string
    ): Promise<boolean> {
        // check if email is valid,
        // we have to check both customer and business 
        // schemas since we are unauthenticated 
        const customer = await Customer.findOne({ email });
        const business = await Business.findOne({ email });

        if (!customer && !business) {
            // allows email enumeration, switch
            // return "Email not found";
            return true;
        }

        // generate token and save it
        // to the users schema with an expiry
        const ephemeralKey = await genResetToken();
        console.log("[>>] One time reset token: ", ephemeralKey);         
        
        // save token to user
        if (customer)
            await Customer.findByIdAndUpdate(
                customer._id, 
                {
                    resetToken: ephemeralKey,
                    resetTokenExpiration: Date.now() + resetTokenExpiry
                }
            );
        
        if(business)
            await Business.findByIdAndUpdate(
                business._id, 
                {
                    resetToken: ephemeralKey,
                    resetTokenExpiration: Date.now() + resetTokenExpiry
                }
            );

        sendEmail(email, ephemeralKey);
        return true;
    }


    // reset account mutation
    /**
     * @description
     * A mutation to reset the user's password
     * 
     * @param token: the user's reset token
     * @param newPassword: the proposed new password 
     * @returns boolean to indicate success
     */
    @Mutation(() => Boolean)
    async resetAccount(
        @Arg("token") token: string,
        @Arg("password") newPassword: string
    ): Promise<boolean> {

        // check if token is valid
        const customer = await Customer.findOne({ 
                            resetToken: token, 
                            resetTokenExpiration: { $gt: Date.now() } 
                        });

        const business = await Business.findOne({ 
                            resetToken: token, 
                            resetTokenExpiration: { $gt: Date.now() } 
                        });

        if (!customer && !business) {
            return false;
        }

        const user = (customer) ? customer : business!;

        // check if the ephemeral key is valid
        if (user.resetToken !== token)
            return false;


        // hash the new password
        const hashedPassword = await argon2.hash(newPassword);

        // update the user
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        return true;
    }

    /** 
     * @description
     * deletes a user
     * from the database and clears
     * their session.
     * 
     * @params res: the express response object
     * @params jwtPayload: the user's JWT token
     * @returns boolean to indicate success
     */
    @UseMiddleware(Authorised)
    @Mutation(() => Boolean)
    async deleteUser(
        @Ctx() { res, jwtPayload }: AppContext,
    ): Promise<boolean> {
        const { userID } = jwtPayload!;

        console.log("[>>] Deleting user: ", userID);

        const customer = await Customer.findById(userID);
        const business = await Business.findById(userID);

        if (!customer && !business) 
            return false;
        
        if (customer) 
            await customer.remove();
        
        if (business) 
            await business.remove();
        
        res.clearCookie(tokenIdentifier);

        console.log("[>>] User deleted");
        return true;
    }


    /**
     * @description
     * A query to find users whose username
     * matches a given username fragment
     * 
     * @param usernameFragment: a string representing a 
     *                          part of a username 
     * @returns a list of users that contain 
     *          the username fragment
     */
    @UseMiddleware(Authorised)
    @Query(() => [CustomerModel])
    async searchUsers(
        @Arg("usernameFragment") usernameFragment: string,
    ) {
        let users = await Customer.find({});

        //match usernames that contain 
        // the fragment
        users = users.filter(
            user => user.username.includes(
                usernameFragment
            )
        );

        return users;
    }


    /**
     * @description
     * query for the number of users 
     * registered on the platform
     * for administrative purposes.
     * 
     * @returns the number of users on the platform
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Query(() => IntResponse)
    async getUsersCount(): Promise<IntResponse> {
        const userCount = await Customer.countDocuments({});
        return { count: userCount};
    }

    /**
     * @description
     * returns the number
     * of businesses registered on the 
     * platform for administrative purposes.
     * 
     * @returns the number of registered businesses
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Query(() => IntResponse)
    async getBusinessCount(): Promise<IntResponse> {
        const businessCount = await Business.countDocuments({});
        return { count: businessCount};
    }
}
