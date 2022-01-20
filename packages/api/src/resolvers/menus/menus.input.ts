import { 
    InputType, 
    Field
} from "type-graphql";

// entity imports
import { ItemCategoryEnum } from "../../entities/MenuItem";

// resolver imports
import { AvailableHoursInput } from "../../shared-resources/inputs/timemodels.input";

/**
 * @description
 * Input format for menu searching
 * 
 * @field itemName: name of a menu item [optional]
 * @field price: cost of the menu item [optional]
 * @field itemKind: type of the menu item [optional]
 * @field isSpecial: boolean describing if the item is on special [optional]
 */
 @InputType()
 export class MenuSearchInput {
     @Field({ nullable: true })
     itemName?: string;
 
     @Field({ nullable: true })
     price?: number;
 
     @Field({ nullable: true })
     itemKind?: string;
 
     @Field({ nullable: true })
     isSpecial?: boolean;
 }
 

/**
 * @description
 * An input type for adding new item types as an admin
 * 
 * @field category: broader item category - "FOOD" or "DRINK"
 * @field type: fine-grained menu item type (e.g. "cocktail, "soft drink")
 */
 @InputType()
 export class AddItemKindInput {
 
     @Field()
     category: ItemCategoryEnum
 
     @Field()
     type: string
 }
 

/**
 * @description
 * Input type for SpecialDateModel
 * 
 * @field specialStart: start date for the special
 * @field specialEnd: end date for the special
 */
 @InputType()
 export class SpecialDateInput {
 
     @Field(() => Date)
     specialStart: Date;
 
 
     @Field(() => Date)
     specialEnd: Date;
 }
 

/**
 * @description
 * Input type for adding a single menu item
 * 
 * @field name: the name of the menu item
 * @field price: the price of the menu item
 * @field isSpecial: a boolean describing if the menu item is on special
 * @field itemKind: the item kind of the menu item (burger etc)
 * @field specialExpiry: the optional special start and expiry date [optional]
 * @field specialHours: optional weekly avaialble hours for the special [optional]
 * @field uploader: the ID of the user uploading the item [optional, only for db population]
 * @field verified: boolean for if the business owner is the uploader [optional]
 */
 @InputType()
 export class AddMenuItemInput {
 
     @Field()
     name: string
 
     @Field()
     price: number
 
     @Field()
     isSpecial: boolean
 
     // the id of the itemkind type that defines the menu item
     @Field()
     itemKind: string
 
     @Field(() => SpecialDateInput, { nullable: true })
     specialExpiry?: SpecialDateInput;
 
     @Field(() => AvailableHoursInput, { nullable: true })
     specialHours?: AvailableHoursInput;
 
     // Added fields for uploader and verified status
     // these are only used by us when populating the database
     // with test data
     @Field({ nullable: true })
     uploader?: string;
 
     @Field({ nullable: true })
     verified?: boolean;
 }
 
 /**
  * @description
  * Input type to upload a whole menu
  * 
  * @field menuItems: an array of menu item inputs
  */
 @InputType()
 export class AddWholeMenuInput {
     @Field(() => [AddMenuItemInput])
     menuItems: AddMenuItemInput[];
 }