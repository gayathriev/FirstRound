import { 
    Resolver,  
    Arg, 
    Ctx,
    UseMiddleware,
    Mutation,
    PubSub
} from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { AppContext } from "../../shared-resources/utils/app.context";

// middleware imports
import { Authorised } from "../../middleware/Authorised";

// entity imports
import { Business, Customer } from "../../entities/Users";

// resolver imports
import { NOTIFICATION } from "../notifications/notifications.resolver";

// input type imports
import { NotificationPayload } from "../notifications/notifications.input";

/**
 * Coordinates sharing items on the platform
*/

@Resolver()
export class ShareResolver {
    
    /**
     * @description
     * Publishes a venue share notification
     * through the pubsub system
     * 
     * @param pubSub: the notification engine
     * @param recipient: the username of the user to send to
     * @param venue: the venue name
     * @param venueID: the venue ID
     * @param jwtPayload: the user's JWT token
     * @returns boolean for successful notification send
     */
    @UseMiddleware(Authorised)
    @Mutation(() => Boolean)
    async shareVenue(
        @PubSub() pubSub: PubSubEngine,
        @Arg("recipient") recipient: string,
        @Arg("venue") venue: string,
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: AppContext,
    ): Promise<boolean> {

        const { userID, username } = jwtPayload!;
        const action = `/menu/${venueID}`;
        const notification: NotificationPayload = {
            recipient: recipient,
            message: `${username} invited you to checkout ${venue}!`,
            action: action,
            senderID: userID,
        }
        await pubSub.publish(NOTIFICATION, notification);
        return true;
    }
    
    
    /**
     * @description
     * Publishes a route share notification
     * through the pubsub system
     * 
     * @param pubSub 
     * @param recipient 
     * @param route 
     * @param routeID  
     * @returns boolean for successful notification send
     */
    @UseMiddleware(Authorised)
    @Mutation(() => Boolean)
    async shareRoute(
        @PubSub() pubSub: PubSubEngine,
        @Arg("recipient") recipient: string,
        @Arg("route") route: string,
        @Arg("routeID") routeID: string,
        @Ctx() { jwtPayload }: AppContext,
    ): Promise<boolean> {
        const { userID, username } = jwtPayload!;
        const action = `/route/${routeID}`;
        const notification: NotificationPayload = {
            recipient: recipient,
            message: `${username} invited you to check out their route ${route}!`,
            action: action,
            senderID: userID,
        }
        await pubSub.publish(NOTIFICATION, notification);

        // save the route id to the recipient's 'shared 
        // with me' route list
        let user;
        user = await Customer.findOne({ username: recipient });
        if (!user)
            user = await Business.findOne({ username: recipient });

        if (user) {
          
            if (!user.sharedRoutes) {
                user.sharedRoutes = [routeID];
            } else {
                user.sharedRoutes.push(routeID);
            }

            await user.save();
        }

        return true;
    }
}