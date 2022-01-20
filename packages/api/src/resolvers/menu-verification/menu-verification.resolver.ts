import {
    Resolver,
    Query,
    Mutation,
    ID,
    Arg,
    UseMiddleware,
    Ctx
} from 'type-graphql'

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { isBusiness } from '../../middleware/isBusiness';

// entity imports
import { RequestStatus } from '../../entities/VenueRequest';
import { Venue } from '../../entities/Venue';
import { Business, Customer } from '../../entities/Users';

// helper function imports
import { testVerified } from "../../shared-resources/utils/test-verified";
import { AppContext } from "../../shared-resources/utils/app.context";

// response imports
import { MenuItemResponse } from "../menus/menus.response";


const errorMsg = "An error occurred"

@Resolver()
export class MenuVerificationResolver {

    /**
     * @description
     * Gets user-uploaded menu data for a given venue owned by the business
     * 
     * @param jwtPayload: The user's JWT token
     * @param venueID: The ID of the venue
     * @returns An array of user-uploaded menu items
     */
    @UseMiddleware(Authorised, isBusiness)
    @Query(() => [MenuItemResponse])
    async getUserUploadedMenuForVenue(
        @Ctx() { jwtPayload }: AppContext,
        @Arg("venueID", () => ID) venueID: string
    ) {

        let menuList = [];

        // check we own the venue and typical null checks on inputs
        if (!jwtPayload) return []

        const venue = await Venue.findById(venueID).populate("menu.itemKind")
        if (!venue) return []
        if (!venue.menu) return []

        const businessUser = await Business.findById(jwtPayload.userID);
        if (!businessUser) return []
        if (!businessUser.verifiedVenues) return []

        // check if there is a Business user where the id is 
        // our user's id and they have a venue
        // with 'venueID' in their verifiedVenues
        const checkOwner = await testVerified (jwtPayload, venueID)
        if (!checkOwner) return []

        // extract all menu items where isVerified is false
        for (var menuItem of venue.menu) {
            if (!menuItem.verified) menuList.push(menuItem)
        }

        // return them
        return menuList
        
    }

    /**
     * @description
     * As the business user that owns the venue,
     * set a given menu item to 'verified' or
     * remove the user uploaded menu data
     * 
     * @param venueID: The ID of the venue
     * @param menuItemID: The ID of the menu item to verify or delete
     * @param decision: The outcome to approve or deny
     * @param jwtPayload: The user's JWT token

     * @returns A verification string on success, or an error string
     */
    @UseMiddleware(Authorised, isBusiness)
    @Mutation(() => [String])
    async processMenuItem(
        @Arg("venueID", () => ID) venueID: string,
        @Arg("menuItemID", () => ID) menuItemID: string,
        @Arg("decision", () => RequestStatus) decision: RequestStatus,
        @Ctx() { jwtPayload }: AppContext
    ) {
        // typical null checks and check the right business owns the venue 
        const checkOwner = await testVerified (jwtPayload, venueID)
        if (!checkOwner) return ["Permission denied"]

        // get the venue
        const venue = await Venue.findById(venueID)
        if (!venue) return [errorMsg]
        if (!venue.menu) return [errorMsg]

        let menuItem = undefined
        // get the menuItem in the venue
        for (var item of venue.menu) {
            if (item._id == menuItemID) {
                menuItem = item
                break
            }
        }

        if (!menuItem) return [errorMsg]


        if (decision === RequestStatus.APPROVED) {
            // if the decision is to verify
            // update the entry so verified is true

            menuItem.verified = true

            const updated = await venue.save()
            if (!updated) return [errorMsg];

            return ["Verification was successful"]
        
        } else if (decision == RequestStatus.REJECTED) {

            // before we delete it, extract the credit value
            const creditValue = menuItem.creditValue

            // get the customer who uploaded the menu item
            const uploader = await Customer.findById(menuItem.uploader)

            // check the customer exists and the credit value is defined
            if (uploader && creditValue) {
                // calculate the credit value with deductions
                let newCredits = uploader.credits - creditValue

                // if it's less than 0 make it 0
                // we don't want negative credits
                if (newCredits < 0) newCredits = 0

                // save their new credit value
                uploader.credits = newCredits
                await uploader.save()
            }


            // delete the subdocument by splicing it off the array
            const index = venue.menu.indexOf(menuItem)
            if (index > -1) {
                venue.menu.splice(index, 1)
            } else {
                return []
            }
            // re-save the menu
            const updated = await venue.save()
            if (!updated) return [errorMsg];

            return ["Deletion was successful"]



        } else {
            return [errorMsg]
        }
    }

}