import {
    prop,
    getModelForClass,
    mongoose,
    Ref,
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    Int as IntGQl,
    Float as FloatGQl,
    registerEnumType,
} from "type-graphql";

// entity imports
import { AvailableHoursModel } from './TimeModels';
import { MenuItemModel } from './MenuItem';
import { PromotionModel } from './Promotion';

/**
 * @description
 * Define venue types
 * 
 * @field CAFE: the venue is a cafe
 * @field RESTAURANT: the venue is a restaurant
 * @field BAR: the venue is a bar
 */
export enum VenueType {
    CAFE = "CAFE",
    RESTAURANT = "RESTAURANT",
    BAR = "BAR"
}

registerEnumType(VenueType, {
    name: "VenueType",
    description: "The set of venue types that we support",
});

/**
 * @description
 * Schema definition for venue tags
 * 
 * @field _id: venue tag ID
 * @field text: the tag text
 */
@ObjectType()
export class VenueTagsModel {
    @Field(() => ID)
    public _id: string;

    @Field()
    @prop({ required: true, unique: true })
    public text!: string;
}

/**
 * @description
 * Subdocument definition
 * To hold a reference to a tag and count
 * 
 * @field _id: a tag ID for a specific venue
 * @field tag: reference to the tag
 * @field count: how many times users have selected
 *               this tag for a given venue
 * @field taggers: an array of users who chose this tag
 */
@ObjectType()
export class MyTags {
    @Field(() => ID)
    public _id: string;

    @Field(() => ID)
    @prop({ required: true, ref: () => VenueTagsModel })
    public tag!: Ref<VenueTagsModel>;

    @Field(() => IntGQl)
    @prop({ required: true })
    public count!: number;

    @prop({ required: true, type: () => [String] })
    public taggers!: string[];
}

/**
 * @description
 * Subdocument definition
 * To store a star rating from
 * a customer user
 * 
 * @field _id: the review ID
 * @field review: the star rating out of five
 * @field reviewer: the user ID of the reviewer
 */
@ObjectType()
export class Reviews {
    @Field(() => ID)
    _id: string;

    @Field(() => IntGQl)
    @prop({ required: true })
    review!: number;

    @Field(() => ID)
    @prop({ required: true })
    reviewer!: string;
}

/**
 * @description
 * Schema definition for map locations
 * 
 * @field _id: ID of the geometry
 * @field type: GeoJSON geometry type
 * @field coordinates: an array of numbers indicating
 *                     coordinates
 */
@ObjectType()
export class GeometryModel {
    @Field(() => ID)
    public _id: string;

    @Field()
    @prop({ required: true })
    public type!: string;

    @Field(() => [FloatGQl])
    @prop({ required: true, type: mongoose.Schema.Types.Number })
    public coordinates!: number[];
}

/**
 * @description
 * Schema definition for venue storage
 * 
 * @field _id: venue ID
 * @field name: venue name
 * @field searchTerms: search terms generated for the venue
 * @field venueType: type of venue
 * @field openingHours: opening hours per day
 * @field menu: a list of menu items [optional]
 * @field promotion: a promotion object [optional]
 * @field uploadValue: how many credits uploading a menu
 *                     item to the venue is worth
 * @field tags: a list of tags [optional]
 * @field location: venue coordinates
 * @field address: venue address
 * @field postcode: venue postcode
 * @field contactNumber: venue contact number
 * @field ratings: a list of star ratings [optional]
 * @field averageRating: the average of all star ratings for the venue
 */
@ObjectType()
export class VenueModel {
    @Field(() => ID)
    public _id: string;

    // names aren't necessarily unique, there are multiple McDonald's
    @Field()
    @prop({ required: true })
    public name!: string;

    @Field(() => [String])
    @prop({ required: true, type: () => [String] })
    public searchTerms!: string[];

    @Field(() => VenueType)
    @prop({ required: true, enum: VenueType })
    public venueType!: VenueType;

    @Field(() => AvailableHoursModel)
    @prop({ required: true, type: () => AvailableHoursModel })
    public openingHours!: AvailableHoursModel;

    // an array of MenuItems (changed from reference to subdocument for quicker access)
    @Field(() => [MenuItemModel], { nullable: true })
    @prop({ type: () => MenuItemModel, required: false })
    public menu?: MenuItemModel[];

    @Field(() => PromotionModel, { nullable: true })
    @prop({ required: false, type: () => PromotionModel })
    public promotion?: PromotionModel;

    // the number of credits that uploading to the venue is currently worth
    @Field(() => IntGQl)
    @prop({ required: true, default: 100 })
    public uploadValue!: number;

    @Field(() => [MyTags], { nullable: true })
    @prop({ required: false, type: () => MyTags, default: [] })
    public tags?: MyTags[];

    @Field(() => GeometryModel)
    @prop({ required: true, type: () => GeometryModel })
    public location!: GeometryModel;

    @Field()
    @prop({ required: true, unique: true })
    public address!: string;

    @Field()
    @prop({ required: true })
    public postcode!: string;

    @Field()
    @prop({ required: true })
    public contactNumber!: string;

    @Field(() => [Reviews], { nullable: true })
    @prop({ required: true, type: () => Reviews, default: [] })
    public ratings?: Reviews[];

    @Field(() => FloatGQl)
    @prop({ required: true, default: 0.0 })
    public averageRating: number;
}

export const Venue = getModelForClass(VenueModel);
export const VenueTags = getModelForClass(VenueTagsModel);
export const Geometry = getModelForClass(GeometryModel);