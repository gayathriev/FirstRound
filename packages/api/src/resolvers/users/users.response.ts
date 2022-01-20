import { 
    Field, 
    ID,
    ObjectType,
    Int as IntGQl
} from "type-graphql";

// entity imports
import { VenueModel } from "../../entities/Venue";
import { RouteSchema } from "../../entities/Route";


/**
 * @description
 * A get self return response
 * 
 * @field userID: the users id extracted 
 *                from the jwt payload
 * @field userName: the users name extracted
 *                 from the jwt payload
 * @field userType: the users type extracted
 *                from the jwt payload
 */
@ObjectType()
export class Self {
    @Field(() => String)
    userID?: string;

    @Field(() => String)
    username?: string;

    @Field(() => String)
    userType?: string;
}


/**
 * @description
 * A login error return response
 * 
 * @field message: the error message
 */
@ObjectType()
class LoginError {

    @Field()
    message: string;
}

/**
 * @description
 * Return an error or the jwt token. 
 * 
 * @field token: the user's token [optional]
 * @field errors: an array of error messages [optional]
 */
@ObjectType()
export class AuthResponse {
    
    @Field(() => String, { nullable: true })
    token?: string;

    @Field(() => String, { nullable: true })
    userType?: string;

    @Field(() => [LoginError], { nullable: true })
    errors?: LoginError[];
}

/**
 * @description
 * Response for resolved promotion data from profile.
 * Includes actual venue data rather than just IDs.
 * 
 * @field _id: the promotion ID [optional]
 * @field creditsRquired: the credits required for the promotion [optional]
 * @field startDate: promotion start date [optional]
 * @field endDate: promotion end date [optional]
 * @field percentageOff: promotion discount [optional]
 * @field venue: resolved information about the venue [optional]
 */
@ObjectType()
export class RedeemedPromotionResponse {
    @Field(() => ID)
    public _id?: string;

    @Field(() => IntGQl)
    public creditsRequired?:  number;

    @Field(() => Date)
    public startDate?: Date;

    @Field(() => Date)
    public endDate?: Date;

    @Field(() => IntGQl)
    public percentageOff?:  number;

    // venue data
    @Field(() => VenueModel)
    public venue?: VenueModel;

}

/**
 * @description
 * Return customer's profile information
 * 
 * @field name: the customer's username [optional]
 * @field _id: the customer's ID [optional]
 * @field email: the customer's email [optional]
 * @field joinedDate: the date the customer joined [optional]
 * @field credits: how many credits the customer has acquired [optional]
 * @field activePromotions: a list of active promotions
 *                          the customer has redeemed [optional]
 * @field futurePromotions: a list of future promotions
 *                          the customer has redeemed [optional]
 * @field expiredPromotions: a list of expired promotions
 *                          the customer has redeemed [optional]
 * 
 */
@ObjectType()
export class ProfileResponse {
    
    // username
    @Field(() => String, { nullable: true })
    public username?: string;

    // id
    @Field(() => String, { nullable: true })
    public id?: string;

    // user type
    @Field(() => String, { nullable: true })
    public userType?: string;

    // email
    @Field(() => String, { nullable: true })
    public email?: string;

    // joined date
    @Field(() => String, { nullable: true })
    public joinedDate?: String;

    // credits
    @Field(() => IntGQl, { nullable: true })
    credits?: number;

    // active promotions
    @Field(() => [RedeemedPromotionResponse], { nullable: true })
    activePromotions?: RedeemedPromotionResponse[];

    // future promotions
    @Field(() => [RedeemedPromotionResponse], { nullable: true })
    futurePromotions?: RedeemedPromotionResponse[];

    // expired promotions
    @Field(() => [RedeemedPromotionResponse], { nullable: true })
    expiredPromotions?: RedeemedPromotionResponse[];

    // todo add myRoutes
    @Field(() => [RouteSchema], { nullable: true })
    myRoutes?: RouteSchema[];

    // todo add sharedRoutes
    @Field(() => [RouteSchema], { nullable: true })
    sharedRoutes?: RouteSchema[];
}


/**
 * @description
 * Returns a single int
 */
@ObjectType()
export class IntResponse {
    @Field()
    count: number;
}