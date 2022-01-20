import {
    prop,
    getModelForClass,
    Ref,
} from '@typegoose/typegoose';
import {
    Field,
    ID,
    ObjectType,
    registerEnumType,
    Int as IntGQl
} from "type-graphql";

// entity imports
import { AvailableHoursModel } from './TimeModels';

/**
 * @description
 * Define special types
 * for menu items
 * 
 * @field FALSE: regular menu item with no special
 * @field REGULAR: standard special with
 *                 optional expiry date times
 * @field TIMED: special only occurs on certain date times
 */
export enum SpecialTypeEnum {
    FALSE = "FALSE",
    REGULAR = "REGULAR",
    TIMED = "TIMED"
}

registerEnumType(SpecialTypeEnum, {
    name: "SpecialTypeEnum",
    description: "The set of special types",
});


/**
 * @description
 * Defines broad item categories
 * 
 * @field FOOD: food items
 * @field DRINK: drink items
 */
export enum ItemCategoryEnum {
    FOOD = "FOOD",
    DRINK = "DRINK"
}

registerEnumType(ItemCategoryEnum, {
    name: "ItemCategoryEnum",
    description: "The set of menu item categories that we support",
});


/**
 * @description
 * Defines Item Kind model
 * 
 * @field _id: ID of the item kind
 * @field category: food or drink broad category
 * @field type: string for item type
 */
@ObjectType()
export class ItemKindModel {
    @Field(() => ID)
    public _id: string;

    // store the item category
    @Field(() => ItemCategoryEnum)
    @prop({ required: true, enum: ItemCategoryEnum })
    public category!: ItemCategoryEnum;

    // the item type
    @Field()
    @prop({ required: true })
    public type!: string;
}


/**
 * @description
 * Object describes special date
 * storage to be stored in menu item
 * 
 * @field specialStart: start date
 * @field specialEnd: end date
 */
@ObjectType()
export class SpecialDateModel {

    @Field(() => Date)
    @prop({ type: () => Date })
    public specialStart: Date;


    @Field(() => Date)
    @prop({ type: () => Date })
    public specialEnd: Date;
}


/**
 * @description
 * Define storage structure for
 * menu items
 * 
 * @field _id: the menu item ID
 * @field name: the menu item name
 * @field price: the menu item price
 * @field itemKind: a reference to the item kind object
 * @field verified: boolean indicating if menu
 *                  item is verified
 * @field uploader: uploader user ID
 * @field promotion: boolean indicating promotion status
 * @field special: special classification
 * @field creditValue: credit score that was given for
 *                     uploading the menu item [optional]
 * @field specialExpiry: special expiry start and
 *                       end dates [optional]
 * @field specialHours: special hours per day
 *                      of the week [optional]
 * @field searchTerms: an array of search terms to handle
 *                     fuzzy searching [optional]
 */
@ObjectType()
export class MenuItemModel {
    @Field(() => ID)
    public _id: string;

    @Field()
    @prop({ required: true })
    public name!: string;

    @Field()
    @prop({ required: true })
    public price!: number;

    // Store a reference to the itemkind
    @Field(() => ID)
    @prop({ required: true, ref: () => ItemKindModel })
    public itemKind!: Ref<ItemKindModel>;

    @Field()
    @prop({ required: true })
    public verified!: boolean;

    // store the id of the user who uploaded
    @Field()
    @prop({ required: true })
    public uploader!: string;

    // store whether the menuItem is part of a promotion
    @Field()
    @prop({ required: true, default: false })
    public promotion!: boolean;

    // store the special type ("FALSE", "REGULAR" or "TIMED")
    // not a special by default
    @Field(() => SpecialTypeEnum)
    @prop({ required: true, enum: SpecialTypeEnum, default: SpecialTypeEnum.FALSE })
    public special!: SpecialTypeEnum;

    // optional credit value at the time of upload
    @Field(() => IntGQl, { nullable: true })
    @prop({ required: false })
    public creditValue?: number;

    // optional expiry time for special
    @Field(() => SpecialDateModel, { nullable: true })
    @prop({ type: () => SpecialDateModel, required: false })
    public specialExpiry?: SpecialDateModel;

    // optional time-based special data
    @Field(() => AvailableHoursModel, { nullable: true })
    @prop({ type: () => AvailableHoursModel, required: false })
    public specialHours?: AvailableHoursModel;

    // optional field to handle fuzzy searching
    @Field(() => [String], { nullable: true })
    @prop({ type: () => [String], required: false })
    public searchTerms?: string[];
}


export const ItemKind = getModelForClass(ItemKindModel);
export const MenuItem = getModelForClass(MenuItemModel);
