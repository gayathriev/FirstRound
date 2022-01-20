import { 
    Resolver, 
    Query, 
    Arg, 
    Mutation, 
    UseMiddleware,
    Ctx
} from "type-graphql";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { isBusiness } from '../../middleware/isBusiness';
import { AdminRoute } from '../../middleware/AdminRoute';

// entity imports
import { 
    ItemKind,
    ItemKindModel,
    ItemCategoryEnum
} from "../../entities/MenuItem";
import { Venue } from "../../entities/Venue";

// helper function imports
import { testVerified } from "../../shared-resources/utils/test-verified";
import { creditEquation } from "../../shared-resources/utils/credit-equation";

// input type imports
import { 
    AddWholeMenuInput,
    AddItemKindInput
} from "./menus.input";

// response imports
import { 
    MenuResponse,
    AllItemKindsResponse
} from "./menus.response";

// local helper imports
import {
    saveMenuItems
} from "./menus.utils";


const noVenueMatch = "An error occurred"
const unauthorised = "Permission denied"


@Resolver()
export class MenuResolver {

    /**
     * @description
     * Upload a whole menu as a business user
     * 
     * @param menuItemData: an array of menu item inputs
     * @param venueID: the ID of the venue
     * @param jwtPayload: the user's JWT token
     * @returns a success boolean confirming upload with an optional error message
     */
    @UseMiddleware(Authorised, isBusiness)
    @Mutation(() => MenuResponse)
    async uploadMenu (
        @Arg("menuItemData") menuItemData: AddWholeMenuInput,
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any
    ) {

        // check the venue exists - check by id
        const venue = await Venue.findById(venueID);
        if (!venue) return { errors: [noVenueMatch], success: false }
        
        
        // do 1 check at the start to make sure our uploader owns this venue
        const isVerified = await testVerified(jwtPayload, venueID);

        // otherwise don't save any data
        if (!isVerified) return { errors: [unauthorised], success: false }

        // loop through the input and add as a menu item to the given venue
        for (var menuItem of menuItemData.menuItems){
            let { name, price, itemKind, isSpecial, specialExpiry, specialHours } = menuItem;

            saveMenuItems (  
                venueID,  
                name,
                price,
                itemKind,
                jwtPayload.userID,
                isSpecial,
                specialExpiry,
                specialHours,
                isVerified
            )

        }

        // only update the credits once at the very end of uploading each menu item
        // if there's no menu items then don't change uploadValue
        if (venue.menu) {
            // now update our venue's credit information
            const newCreditValue = await creditEquation(venue.menu.length)
            
            venue.uploadValue = newCreditValue
            await venue.save()
        }

        return { success: true }

    }

    /**
     * @description
     * A service mutation to add new menu item types as an admin
     * 
     * @param itemKindData: data type describing the item kind to be uploaded
     * @returns the ItemKindModel for the newly created item kind
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Mutation(() => ItemKindModel)
    async addItemKind (
        @Arg("itemKindData") itemKindData: AddItemKindInput,
    ) {

        const { category, type } = itemKindData

        // make a new item in the database
        const newItemKind = await (await ItemKind.create({
            category: category,
            type: type,
        })).save();
        
        // return the data
        return newItemKind

    }

    /**
     * @description
     * Return all the item kinds for frontend display
     * 
     * @returns An array of populated item kind data
     */
    @Query(() => AllItemKindsResponse)
    async getAllItemKinds() {
        const food = await ItemKind.find({ category: ItemCategoryEnum.FOOD })
        const drink = await ItemKind.find({ category: ItemCategoryEnum.DRINK })
        
        return { food: food, drink: drink }
    }

}