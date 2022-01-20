import { JwtPayload } from "jsonwebtoken";
import { PubSubEngine } from "graphql-subscriptions";

// entity imports
import { Customer } from "../../entities/Users";
import { 
    ItemKind,
    SpecialTypeEnum,
    SpecialDateModel
} from "../../entities/MenuItem";
import { Venue, VenueModel } from "../../entities/Venue";

// resolver imports
import { UserType } from "../users/users.constants";
import { NotificationPayload } from "../notifications/notifications.input";
import { NOTIFICATION } from "../notifications/notifications.resolver";
import { AvailableHoursInput } from "../../shared-resources/inputs/timemodels.input";

// helper function imports
import { imageRecognition } from "../../shared-resources/utils/image-recognition";
import { testVerified } from "../../shared-resources/utils/test-verified";
import { creditEquation } from "../../shared-resources/utils/credit-equation";
import { generateNGrams } from "../../shared-resources/utils/fuzzy-searching";

// input type imports
import {  SpecialDateInput } from "./menus.input";


/**
 * @description
 * Check if the venue already has a menu item with
 * the same name and special type as the business owner
 * is trying to upload.
 * 
 * If so, override the existing menu items.
 * 
 * @param incomingName: name of the new menu item
 * @param incomingSpecialType: special type of the new menu item
 * @param venue: a Venue object
 * @returns true if a menu item is overridden, false otherwise
 */
async function overrideMenuItem (
    incomingName: string,
    incomingSpecialType: SpecialTypeEnum,
    venue: VenueModel
) {

    if (!venue || !venue.menu) return false

    // should match regardless of case, so perform it in lower
    incomingName = incomingName.toLowerCase();

    let matches = [] 
    for (var menuItem of venue.menu) {
        let lowerMenuName = menuItem.name.toLowerCase()
        if (lowerMenuName == incomingName && menuItem.special == incomingSpecialType) {
            matches.push(menuItem)
        }
    }

    // splice them off the subdocument array
    for (var match of matches) {
        let index = venue.menu.indexOf(match)
        if (index > -1) venue.menu.splice(index, 1)
    }

    return true
}

/**
 * @description
 * Test if the menu image text matches the 
 * menu item data using image recognition
 * 
 * @param menuText: text extracted from the uploaded image
 * @param name: the name of the menu item
 * @param price: the price of the menu item
 * @returns a boolean value of whether the menu item could be validated
 */
export async function validateMenuText (
    menuText: string,
    name: string,
    price: number
) {
    // to make a case insensitive search, change all the text fields to lowercase
    menuText = menuText.toLowerCase();
    name = name.toLowerCase();

    // split the menu name into individual words
    let searchTerms = name.split(" ")

    // make a price mutation without a '.'
    const priceString = price.toString()
    searchTerms.push(priceString)
    searchTerms.push(...priceString.split("."))


    let count: number = 0

    // loop through the array
    for (let word of searchTerms) {
        // regex search the menuText, add it to count if we find it
        if (menuText.search(word) > -1) count = count + 1
    }

    // developer controlled limit - set to 50% match
    const minPercent = 0.5


    // if count is greater than min percent return true,
    // else return false
    const matchPercent = count/(searchTerms.length)
    console.log("[>>] Match percent on image recognition was " +matchPercent)
    if (matchPercent < minPercent) return false
    

    return true

}


/**
 * @description
 * Creates a new menu item
 * 
 * @param venueID: the venue ID
 * @param name: the name of the menu item
 * @param price: the price of the menu item
 * @param itemKind: the item kind of the menu item (burger etc)
 * @param uploader: the ID of the user uploading the item
 * @param isSpecial: a boolean describing if the menu item is on special
 * @param specialExpiry: the optional special start and expiry date
 * @param specialHours: optional weekly avaialble hours for the special
 * @param isVerified: boolean for if the business owner is the uploader
 */
export async function saveMenuItems (  
    venueID: string,  
    name: string,
    price: number,
    itemKind: string,
    uploader : string,
    isSpecial: boolean,
    specialExpiry: SpecialDateModel | undefined,
    specialHours: AvailableHoursInput | undefined,
    isVerified: boolean
) {
    const venue = await Venue.findById(venueID);
    if  (!venue) return

    // check the item kind actually exists
    const itemKindObj = await ItemKind.findById(itemKind);
    if (!itemKindObj) return

    // make sure the name has sensible casing - cast first letter to upper
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    let special: SpecialTypeEnum = SpecialTypeEnum.FALSE

    if (isSpecial) {
        // if it has specialHours make it time-based, otherwise it's just regular
        special = (specialHours) ? SpecialTypeEnum.TIMED : SpecialTypeEnum.REGULAR;
    } else {
        // make sure no data is being saved in specials fields for a regular item
        specialExpiry = undefined
        specialHours = undefined
    }

    if (!venue.menu) venue.menu = []
    
    // check to override existing menu items with same name and type before saving ours
    // only if it's the business user who owns the venue
    if (isVerified) {
        const didRemove = await overrideMenuItem(
            name,
            special,
            venue
        )
    }
    
    const subdoc = {
        name: formattedName,
        price: price,
        verified: isVerified,
        itemKind: itemKind,
        uploader: uploader,
        special: special,
        creditValue: venue.uploadValue,
        specialExpiry: specialExpiry,
        specialHours: specialHours,
        searchTerms: generateNGrams(name),
    }

    // add an "any" cast to the subdocument to address typescript issues
    venue.menu.push(<any> subdoc)

    const updated = await venue.save()
}

/**
 * @description
 * Upload a menu item taking in menu item data,
 * image data and the user token for verification
 * 
 * Called from the upload resolver
 * 
 * @param name: the name of the menu item
 * @param price: the price of the menu item
 * @param itemKind: the item kind of the menu item (burger etc)
 * @param isSpecial: a boolean describing if the menu item is on special
 * @param specialExpiry: the optional special start and expiry date
 * @param specialHours: optional weekly avaialble hours for the special
 * @param venueID: the venue ID
 * @param jwtPayload: the user's JWT token
 * @param scheduler: the image recognition scheduler
 * @param imageURL: the firebase URL for the user's uploaded menu image
 * @param pubSub: the notification engine
 * @returns a boolean confirming successful menu item upload
 */
export async function uploadMenuItem (
    name: string, 
    price: number, 
    itemKind: string,
    isSpecial: boolean,
    specialExpiry: SpecialDateInput | undefined,
    specialHours: AvailableHoursInput | undefined,
    venueID: string,
    jwtPayload: JwtPayload,
    scheduler: Tesseract.Scheduler,
    imageURL: string,
    pubSub: PubSubEngine,
) {

    // check the venue exists - check by id
    const venue = await Venue.findById(venueID);
    if  (!venue) {
        return false
    } else {
        const recipient = jwtPayload.username;
        const action = `/menu/${venue._id}`

        const isVerified = await testVerified(jwtPayload, venueID);
        const menuText = await imageRecognition(imageURL, scheduler);

        // check whether our terms are on the menu
        const imageVerification = await validateMenuText (menuText, name, price);

        // don't proceed to save the menu item unless we verified the image
        if (!imageVerification) {
            // notify on reject
            await pubSub.publish(NOTIFICATION, {
                recipient: recipient,
                message: `Your menu addition for ${venue.name} could not be verified \
                          please try again with a clearer photo.`,
                action: action
            }); 
            return false;
        }
        

        await saveMenuItems (  
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

        // save the credits to our user -- only if customer
        if (jwtPayload.userType == UserType.CUSTOMER) {
            // get the user by their ID
            const customer = await Customer.findById(jwtPayload.userID)

            if (customer) { 
                // get their new credit amount
                const newAmount =  customer.credits + venue.uploadValue

                // add the credit value to their account
                customer.credits = newAmount
                await customer.save()
            }
            
        }


        // if there's no menu items then don't change uploadValue
        if (venue.menu) {
            // now update our venue's credit information
            const newCreditValue = await creditEquation(venue.menu.length);
            
            venue.uploadValue = newCreditValue;
            await venue.save()
        }

        const notification: NotificationPayload = {
            recipient: recipient,
            message: `${name} has been uploaded to ${venue.name}`,
            action: action
        };

        await pubSub.publish(NOTIFICATION, notification);
        return true;
    }
}