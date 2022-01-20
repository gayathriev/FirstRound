import {
    prop,
    Ref
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    Int as IntGQl
} from "type-graphql";

// entity imports
import { VenueModel } from "./Venue"


/**
 * @description
 * Subdocument definition
 * Describes how promotions are
 * stored in user profiles
 * 
 * @field _id: the promotion ID [optional]
 * @field creditsRequired: how many credits were required
 *                         to redeem promotion
 * @field startDate: promotion start date
 * @field endDate: promotion end date
 * @field percentageOff: promotion discount
 * @field venue: reference to the venue holding the promotion
 */
@ObjectType()
export class RedeemedPromotionModel {
    @Field(() => ID)
    public _id?: string

    @Field(() => IntGQl)
    @prop({ required: true })
    public creditsRequired!:  number;

    @Field(() => Date)
    @prop({ type: () => Date, required: true })
    public startDate!: Date;

    @Field(() => Date)
    @prop({ type: () => Date, required: true })
    public endDate!: Date;

    @Field(() => IntGQl)
    @prop({ required: true })
    public percentageOff!:  number;

    // the venue for which the promotion is stored
    @Field(() => ID)
    @prop({ required: true, ref: () => VenueModel })
    public venue!: Ref<VenueModel>;

}

/**
 * @description
 * Subdocument definition
 * Describes how promotions are
 * stored in venues
 * 
 * @field _id: the promotion ID
 * @field creditsRequired: how many credits were required
 *                         to redeem promotion
 * @field startDate: promotion start date
 * @field endDate: promotion end date
 * @field percentageOff: promotion discount
 */
@ObjectType()
export class PromotionModel {
    @Field(() => ID)
    public _id: string

    @Field(() => IntGQl)
    @prop({ required: true })
    public creditsRequired!:  number;

    @Field(() => Date)
    @prop({ type: () => Date, required: true })
    public startDate!: Date;

    @Field(() => Date)
    @prop({ type: () => Date, required: true })
    public endDate!: Date;

    @Field(() => IntGQl)
    @prop({ required: true })
    public percentageOff!:  number;
}