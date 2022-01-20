import {
    prop,
    Ref,
    getModelForClass
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    registerEnumType,
} from "type-graphql";

// entity imports
import { BusinessModel } from './Users';
import { VenueModel } from './Venue';

/**
 * @description
 * An enum describing all possible
 * statuses for a venue request
 * 
 * @field PENDING: venue request is awaitng verification
 * @field APPROVED: business user has been verified as owner
 * @field REJECTED: venue request has been rejected
 */
export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

registerEnumType(RequestStatus, {
    name: "RequestStates",
    description: "The possible states for the request",
});

/**
 * @description
 * Venue Request data definition
 * 
 * @field _id: ID of the venue request
 * @field venue: reference to the venue
 * @field claimant: reference to the business user
 * @field verificationDocuemnts: url to verification document
 * @field status: approved, pending or rejected
 * @field reasonForRejection: [optional]
 */
@ObjectType()
export class VenueRequestSchema {
    @Field(() => ID)
    _id: string;

    @Field(() => ID)
    @prop({ required: true, ref: () => VenueModel })
    venue!: Ref<VenueModel>;

    @Field(() => ID)
    @prop({ required: true, ref: () => BusinessModel, type: () => String })
    claimant!: Ref<BusinessModel>;

    @Field()
    @prop({ required: true })
    verificationDocuments!: string;

    @Field(() => RequestStatus)
    @prop({ required: true, enum: RequestStatus })
    status!: RequestStatus;

    @Field(() => String)
    @prop({ required: false })
    reasonForRejection?: string;
}

export const VenueRequestModel = getModelForClass(VenueRequestSchema);
