import { 
    Resolver,  
    Arg, 
    Ctx,
    Query,
    InputType, 
    Field, 
    ObjectType,
    UseMiddleware,
    Subscription,
    Root,
    PubSub
} from "type-graphql";
import { AppContext } from "../../shared-resources/utils/app.context";

// middleware imports
import { Authorised } from "../../middleware/Authorised";

// entity imports
import { Business, Customer } from "../../entities/Users";

// resolver imports
import { UserType } from "../users/users.constants";

// input type imports
import { NotificationPayload } from "./notifications.input";

// response imports
import { Notification } from "./notifications.response";


/**
 * Notifications system pipeline
*/
export const NOTIFICATION = "NOTIFICATION";

@Resolver()
export class NotificationsResolver {

    /**
     * @description
     * Listen for notifications published
     * through the pubsub system. A notification
     * contains the intended recipient, the message
     * and an optional action in the form of a 
     * redirect URI.
     * 
     * This currently acts as a global 
     * notifications listener because
     * it does not perform any filtering
     * based on uid or similar. 
     * 
     * @returns a notification
     */
    @Subscription({
        topics: NOTIFICATION,
        filter: ({ payload, context }) => {
            return !!(payload.recipient == context.username)
        }
    })
    feed(
        @Root() { 
            recipient, 
            message, 
            action, 
            senderID 
        }: NotificationPayload
    ): Notification {

        let user;
        user = Customer.findOne({ username: recipient });
        if (!user)
            user = Business.findOne({ username: recipient });

        const notification: Notification = {
            recipient: recipient,
            message: message,
            date: new Date(),
            action: action,
            senderID: senderID
        }

        if (user) {
            user.update({
                "$push": { "feed": notification }
            }).exec();
        }

        return notification;
    }


    /**
     * @description
     * Pulls a users notification
     * feed and returns notifications
     * from the last 10 days.
     * 
     * @param jwtPayload: the User's JWT token
     * @returns An array of notifications from the past 10 days
     */
    @UseMiddleware(Authorised)
    @Query(() => [Notification])
    async getNotifications(
        @Ctx() { jwtPayload }: AppContext
    ): Promise<Notification[]> {
        
        let user;
        if (jwtPayload!.userType === UserType.BUSINESS)
            user = await Business.findById(jwtPayload!.userID);
        else 
            user = await Customer.findById(jwtPayload!.userID);
    
        if (!user) return [];


        const feed = user.feed.reverse();    
        return feed;
    }
}