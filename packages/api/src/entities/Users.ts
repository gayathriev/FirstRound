import {
    prop,
    getModelForClass,
    Ref
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    Int as IntGQL
} from "type-graphql";

// entity imports
import { VenueModel } from './Venue';
import { RedeemedPromotionModel } from './Promotion';
import { RouteSchema } from './Route';

// response imports
import { Notification } from '../resolvers/notifications/notifications.response';


/**
 * @description
 * Base user schema definition
 * 
 * @field _id: the user's ID
 * @field username: user's username
 * @field email: the user's email
 * @field password: the user's password
 * @field feed: the user's notification feed
 * @field resetToken: the user's password reset token [optional]
 * @field resetTokenExpiration: when the reset token expires [optional]
 * @field createdAt: date-time when the user was created
 * @field myRoutes: array storing the user's routes
 * @field sharedRoutes: array storing routes shared with the user
 */
@ObjectType()
export class UserModel {

    @Field(() => ID)
    public _id: string;

    @Field()
    @prop({ required: true, unique: true })
    public username!: string;

    @Field()
    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @Field(() => [Notification])
    @prop({ default: []})
    public feed!: Notification[];

    @prop({ 
        required: false, 
        unique: true, 
        nullable: true 
    })
    resetToken?: string;

    @prop({required: false, nullable: true})
    resetTokenExpiration?: number;

    @Field(() => String)
    @prop({ default: Date.now })
    public createdAt: string;

    @Field(() => [ID], { nullable: true })
    @prop({ ref: () => RouteSchema, required: false })
    public myRoutes?: Ref<RouteSchema>[];

    @Field(() => [ID], { nullable: true })
    @prop({ ref: () => RouteSchema, required: false })
    public sharedRoutes?: Ref<RouteSchema>[];
};


/**
 * @description
 * Additional schema fields for admins
 * 
 * @field user: inherit all fields from user
 */
@ObjectType()
export class AdminModel extends UserModel {

    // inherit from user defs
    @prop({ ref: () => UserModel })
    public user: UserModel;
};

/**
 * @description
 * Additional schema fields for customers
 * 
 * @field credits: how many credits the customer has
 * @field user: inherit all fields from user
 * @field redeemedPromotions: an array of promotions redeemed
 *                            by the customer 
 */
@ObjectType()
export class CustomerModel extends UserModel {

    @Field(() => IntGQL)
    @prop({ default: 0 })
    public credits!: number;

    // inherit from user defs
    @prop({ ref: () => UserModel })
    public user: UserModel;

    // store promotions redeemed by the user
    @Field(() => [RedeemedPromotionModel])
    @prop({ type: () => RedeemedPromotionModel, default: [] })
    public redeemedPromotions!: RedeemedPromotionModel[];
};

/**
 * @description
 * Additional schema fields for businesses
 * 
 * @field user: inherit all fields from user
 * @field verifiedVenues: list of venues the
 *                        business owns [optional]
 */
@ObjectType()
export class BusinessModel extends UserModel {

    // inherit from user defs
    @prop({ ref: () => UserModel})
    public user: UserModel;

    // list of verified venues
    // an array of references to Venues
    @Field(() => [ID], { nullable: true })
    @prop({ ref: () => VenueModel, required: false })
    public verifiedVenues?: Ref<VenueModel>[];
    
};


export const User = getModelForClass(UserModel);
export const Admin = getModelForClass(AdminModel);
export const Business = getModelForClass(BusinessModel);
export const Customer = getModelForClass(CustomerModel);
