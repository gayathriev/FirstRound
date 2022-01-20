import { 
    Field, 
    ObjectType,
    ID
} from "type-graphql";

// entity imports
import {
    ItemKindModel,
    SpecialTypeEnum,
    SpecialDateModel,
    ItemCategoryEnum
 } from "../../entities/MenuItem";
import { AvailableHoursModel } from "../../entities/TimeModels";

/**
 * @description
 * A menu response to return either an error or a menu
 * 
 * @field errors: an array of error strings [optional]
 * @field success: a boolean success value [optional]
 */
@ObjectType()
export class MenuResponse {
    @Field(() => [String], { nullable: true })
    errors?: string[];

    @Field(() => Boolean, { nullable: true })
    success?: boolean;
}

/**
 * @description
 * Return type for resolved
 * item kind results
 * 
 * @field _id: ID of the item kind
 * @field category: food or drink
 * @field type: item type (cocktail, milkshake etc.)
 */
@ObjectType()
export class ItemKindResponse {
    @Field(() => ID)
    _id: string;

    // store the item category
    @Field(() => ItemCategoryEnum)
    category: ItemCategoryEnum;

    // the item type
    @Field()
    type: string;
}

/**
 * @description
 * A response type for returning menu
 * items with item kinds resolved to 
 * field data rather than just IDs
 * 
 * @field _id: the menu item ID
 * @field name: the menu item name
 * @field price: the menu item price
 * @field itemKind: item kind classification
 * @field verified: boolean indicating if menu
 *                  item is verified
 * @field uploader: uploader user ID
 * @field promotion: boolean indicating promotion status
 * @field special: special classification
 * @field specialExpiry: special expiry start and
 *                       end dates [optional]
 * @field specialHours: special hours per day
 *                      of the week [optional]
 */
@ObjectType()
export class MenuItemResponse {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field(() => ItemKindResponse)
    itemKind: ItemKindResponse;

    @Field()
    verified: boolean;

    @Field()
    uploader: string;

    @Field()
    promotion: boolean;

    @Field(() => SpecialTypeEnum)
    special: SpecialTypeEnum;

    @Field(() => SpecialDateModel, { nullable: true })
    specialExpiry: SpecialDateModel;

    @Field(() => AvailableHoursModel, { nullable: true })
    specialHours: AvailableHoursModel;
}

/**
 * @description
 * Return the various itemkinds in their corresponding categories
 * 
 * @field food: an array of item kinds in the food category [optional]
 * @field drink: an array of item kinds in the drink category [optional]
 */
@ObjectType()
export class AllItemKindsResponse {
    @Field(() => [ItemKindModel], { nullable: true })
    food?: ItemKindModel[];

    @Field(() => [ItemKindModel], { nullable: true })
    drink?: ItemKindModel[];
}