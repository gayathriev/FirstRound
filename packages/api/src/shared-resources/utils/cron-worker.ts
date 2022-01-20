// entity imports
import { Venue } from "../../entities/Venue";
import {
    Customer,
    Business
} from "../../entities/Users";


/**
 * @description
 * Helper function to tidy expired
 * promotions, specials and old
 * notifications from databases
 */
export const cronHelper = async () => {

    console.log("[>>] Running cron job cleanup 🗑️")
    // get all the venues
    const venues = await Venue.find({}).populate(["tags.tag", "menu.itemKind"]);

    let today = new Date()
    for (let venue of venues) {
        let toDelete =  false;
        let matches = [];

        // find all the specials for the menu
        if (venue.menu) {
            for (let menuItem of venue.menu) {
                // see if it's a special
                if (menuItem.specialExpiry) {
                    // is it expired?
                    if (menuItem.specialExpiry.specialEnd < today) {
                        matches.push(menuItem);
                    }
                }
            }
            // splice them off the subdocument array
            for (var match of matches) {
                // console log the cron
                console.log("[>>] Cron deleted expired menu item (expiry " +
                match.specialExpiry?.specialEnd + ", name " +
                match.name + ") from " + venue.name);

                let index = venue.menu.indexOf(match);
                if (index > -1) venue.menu.splice(index, 1);
                toDelete = true;
            }
        }

        // get all the promotions
        if (venue.promotion) {
            // if it's expired
            if (venue.promotion.endDate < today) {
                // console log the cron
                console.log("[>>] Cron deleted expired promotion (expiry " +
                venue.promotion.endDate + ") from " + venue.name);

                // make the promotion field of all menu items for the venue false
                if (venue.menu) {
                    for (let menuItem of venue.menu) {
                        if (menuItem.promotion) menuItem.promotion = false;
                    }
                }

                // delete the promotion
                venue.promotion = undefined;
                toDelete = true;
            }  
        }
        
        // if we changed anything about the venue then re-save the venue
        if (toDelete) await venue.save();
    }
    
    // get all customer users
    const customers = await Customer.find({});
    let tenDaysAgo = new Date();
    // set to 10 days ago
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    for (let customer of customers) {
        let newCustomerFeed = customer.feed.filter(notification => {
            return notification.date > tenDaysAgo;
        });

        // check if there are expired notifications
        if (customer.feed.length > newCustomerFeed.length) {
            // save the filtered version
            customer.feed = newCustomerFeed;
            await customer.save();
            console.log("[>>] Cron deleted expired notifications for user " +
            customer.username);
        }
    }

    // get all business users
    const businesses = await Business.find({});
    for (let business of businesses) {
        let newBusinessFeed = business.feed.filter(notification => {
            return notification.date > tenDaysAgo;
        });

        // check if there are expired notifications
        if (business.feed.length > newBusinessFeed.length) {
            // save the filtered version
            business.feed = newBusinessFeed;
            await business.save();
            console.log("[>>] Cron deleted expired notifications for user " +
            business.username);
        }
    }
}

