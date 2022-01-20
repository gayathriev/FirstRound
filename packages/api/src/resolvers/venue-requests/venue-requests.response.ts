import {
    ID,
    ObjectType,
    Field,
} from 'type-graphql'

// entity imports
import { RequestStatus } from "../../entities/VenueRequest";
import { VenueModel} from "../../entities/Venue";
import { BusinessModel } from "../../entities/Users";


/**
 * @description
 * Response type to return venue requests
 * 
 * We need to define a return type for queries on venue requests,
 * this is because the schema stores IDs for the associated venues
 * and businesses (rather than subdocuments), and so if we want to
 * get that information we need to define the shape of the information
 * returned and query the related models manually
 * 
 * @field _id: the venue request ID
 * @field venue: the venue object relating to the claim
 * @field claimant: the business user object
 * @field verificationDocuments: url to documentation
 * @field reasonForRejection: admin comment regarding rejection [optional]
 * @field status: status of the request (approved, denied, pending)
 */
 @ObjectType()
 export class VenueRequestResponse {
     @Field(() => ID)
     _id: string;
 
     @Field(() => VenueModel)
     venue: VenueModel;
 
     @Field(() => BusinessModel)
     claimant: BusinessModel;
 
     @Field()
     verificationDocuments!: string;
 
     @Field()
     reasonForRejection?: string;
 
     @Field(() => RequestStatus)
     status: RequestStatus;
 }
 
/**
 * @description
 * A return type for venue verification requests
 * 
 * @field errors: an array of error strings [optional]
 * @field content: a venue request response [optional]
 */
 @ObjectType()
 class VerificationResponse {
 
     @Field(() => [String], { nullable: true })
     errors?: string[];
 
     @Field(() => VenueRequestResponse, { nullable: true })
     content?: VenueRequestResponse;
 }