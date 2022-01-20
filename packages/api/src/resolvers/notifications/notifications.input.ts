import { 
    InputType, 
    Field
} from "type-graphql";


/**
 * @description
 * Input type for firing notification payloads
 * 
 * @field recipient: username of the notification recipient
 * @field message: the string message to send
 * @field action: action in the form of a URI to navigate to when the
 *        notification is clicked [optional]
 * @field senderID: user ID of the sender [optional]
 */
 @InputType()
 export class NotificationPayload {
     @Field()
     recipient: string;
     
     @Field()
     message: string;
 
     @Field()
     action?: string;
 
     @Field()
     senderID?: string;
 }