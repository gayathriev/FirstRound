import {
    Resolver, 
    Arg, 
    Mutation, 
    UseMiddleware,
    Ctx
} from "type-graphql";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { isBusiness } from '../../middleware/isBusiness';

// entity imports
import { Venue } from "../../entities/Venue";
import { Customer } from "../../entities/Users";

// helper function imports
import { testVerified } from "../../shared-resources/utils/test-verified";

// input type imports
import { PromotionInput } from "./promotions.input";

// response imports
import { MutationResponse } from "./promotions.response";


const errorMsg = "An error occurred"
const permissionMsg = "Permission denied"
const invalidInputMsg = "Invalid input"
const creditsMsg = "You do not have enough credits"


@Resolver()
export class PromotionsResolver {

    /**
     * @description
     * A mutation to create a promotion as the owner of a given business
     * 
     * @param venueID: the ID of the venue
     * @param promotionInput: promotion data input type
     * @param jwtPayload: user's JWT token
     * @returns a MutationResponse object with a success 
     *          boolean and optional errors
     */
    @UseMiddleware(Authorised, isBusiness)
    @Mutation(() => MutationResponse)
    async addPromotion(
        @Arg("venueID") venueID: string,
        @Arg("promotionInput") promotionInput: PromotionInput,
        @Ctx() { jwtPayload }: any,
    ) {
        
        // check end date is after or on start date
        const endTime = promotionInput.endDate.getTime()
        const startTime = promotionInput.startDate.getTime()
        if (endTime < startTime) {
            return { errors: [invalidInputMsg, "End date must be on or after start date"], success: false }
        }

        // make sure we are the owner of the venue, otherwise don't proceed
        const allowed = await testVerified(jwtPayload, venueID)
        if (!allowed) return { errors: [permissionMsg], success: false }

        // get the venue + check it exists
        const venue = await Venue.findById(venueID)
        if (!venue || !venue.menu) return { errors: [errorMsg], success: false }

        let menuItemFlag = false
        let indexInInput: number
        
        // go through the menuItems in our venue
        for (var menuItem of venue.menu) {

            // this stops us from making duplicate calls
            // and accessing menu items from other venues

            // cast menuItem._id to string and check if in the inputted array
            indexInInput = promotionInput.menuItemIDs.indexOf(menuItem._id.toString())

            if (indexInInput > -1) {
                // set the value of promotion to true
                menuItem.promotion = true
                menuItemFlag = true
            } else {
                // to remove legacy data from previous promotions
                menuItem.promotion = false
            }
        }

        // don't make a promotion if there were no valid menu items in it
        if (!menuItemFlag) return { errors: [errorMsg], success: false }

        // add the promotion to the venue's list of promotions
        const subdoc = {
            creditsRequired: promotionInput.creditsRequired,
            startDate: promotionInput.startDate,
            endDate: promotionInput.endDate,
            percentageOff: promotionInput.percentageOff
        }

        venue.promotion = <any> subdoc

        const res = await venue.save()
        if (!res) return { errors: [errorMsg], success: false }

        return { success: true }
    }

    /**
     * @description
     * A mutation to delete a promotion as the owner of a given business
     * 
     * @param venueID: the ID of the venue
     * @param jwtPayload: user's JWT token
     * @returns a MutationResponse object with a success boolean and optional errors
     */
    @UseMiddleware(Authorised, isBusiness)
    @Mutation(() => MutationResponse)
    async deletePromotion(
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any,
    ) {
        // check we own the venue
        const allowed = await testVerified(jwtPayload, venueID)
        if (!allowed) return { errors: [permissionMsg], success: false }

        // if so, check there is currently a promotion
        const venue = await Venue.findById(venueID)
        if (!venue || !venue.promotion) return { errors: [errorMsg], success: false }

        // remove the promotion
        venue.promotion = undefined

        if (!venue.menu) return { errors: [errorMsg], success: false }

        // go through the menuItems in our venue
        for (var menuItem of venue.menu) {
            if (menuItem.promotion) menuItem.promotion = false
        }

        // save the venue
        const res = await venue.save()
        if (!res) return { errors: [errorMsg], success: false }

        return { success: true }
    }

    /**
     * @description
     * A mutation to redeem a promotion as a customer
     * 
     * @param venueID: the ID of the venue
     * @param jwtPayload: user's JWT token
     * @returns a MutationResponse object with a success boolean and optional errors
     */
    @UseMiddleware(Authorised)
    @Mutation(() => MutationResponse)
    async redeemPromotion(
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any,
    ) {
        // get the venue and check they have an unexpired promotion
        const venue = await Venue.findById(venueID)
        if (!venue) console.log("NO VENUE MATCH")
        if (!venue || !venue.promotion) return { errors: ["no venue or no promotion", errorMsg], success: false }

        // Get the user, check they are a customer and have the required credits
        const customer = await Customer.findById(jwtPayload.userID)
        if (!customer) return { errors: ["no such customer", errorMsg], success: false }

        if (customer.credits < venue.promotion.creditsRequired) {
            return { errors: [creditsMsg], success: false }
        }

        // Subtract the credits from their account
        const newCredits = customer.credits - venue.promotion.creditsRequired
        customer.credits = newCredits

        const {creditsRequired, startDate, endDate, percentageOff} = venue.promotion;
        // Create a correctly formatted subdoc for Redeemed Promotion
        const subdoc = {
            creditsRequired: creditsRequired,
            startDate: startDate,
            endDate: endDate,
            percentageOff: percentageOff,
            venue: venue._id
        }

        // Save the promotion to the customer's profile
        customer.redeemedPromotions.push(subdoc);

        await customer.save();

        return { success: true }
    }
}