import { 
    Field, 
    ObjectType
} from "type-graphql";

/**
 * @description
 * Response type for firing notifications
 * 
 * @field recipient: username of the notification recipient
 * @field message: the string message to send
 * @field date: the date the notification was sent by the server [optional]
 * @field action: action in the form of a URI to navigate to when the
 *        notification is clicked [optional]
 * @field senderID: user ID of the sender [optional]
 *  
 */
 @ObjectType()
 export class Notification {
     @Field()
     recipient: string;
 
     @Field()
     message: string;
 
     @Field()
     date!: Date;
 
     @Field({nullable: true})
     action?: string;
 
     @Field({nullable: true})
     senderID?: string;
 }