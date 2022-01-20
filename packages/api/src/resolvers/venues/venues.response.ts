import { 
    Arg,
    Field,
    Int as IntGQl,
    Float as FloatGQl,
    ObjectType
} from "type-graphql";

// entity imports
import {
    VenueType,
    GeometryModel
} from "../../entities/Venue";
import {
    AvailableHoursModel
} from '../../entities/TimeModels';
import { PromotionModel } from "../../entities/Promotion";

// response imports
import { MenuItemResponse } from "../menus/menus.response";

/**
 * @description
 * Response for dealing with actual tag object
 * 
 * @field _id: the tag ID
 * @field text: the tag string (e.g. "DJ")
 */
 @ObjectType()
 export class TagResponse {
     @Field()
     _id: string;
 
     @Field()
     text: string;
 }
 
 /**
  * @description
  * Response type for dealing with tags associated with
  * a venue
  * 
  * @field _id: the tag ID
  * @field tag: the tag string
  * @field count: the number of votes for that tag
  *               at that venue
  */
 @ObjectType()
 export class VenueTagsResponse {
     @Field()
     _id: string;
 
     @Field(() => TagResponse)
     tag: TagResponse;
 
     @Field(() => IntGQl)
     count: number;
 }
 
 /**
  * @description
  * Venue response type with tag references popupulated to objects
  * 
  * @note
  * Because venue tags are references to objects, rather than object themselves,
  * when we return a venue with tags we need to explicitly tell GraphQL the types
  * it will get back (otherwise it expects a list of ids and gets surprised at the
  * actual tag objects)
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
  * @field tags: a list of tags[optional]
  * @field location: venue coordinates
  * @field address: venue address
  * @field postcode: venue postcode
  * @field contactNumber: venue contact number
  * @field ratings: a list of star ratings [optional]
  * @field averageRating: the average of all star ratings for the venue
  * @field averagePrice: average menu item price
  * @field isPromotion: boolean indicating if a promotion is on
  */
 @ObjectType()
 export class VenueResponse {
     @Field(() => String)
     _id: string;
 
     @Field()
     name: string;
 
     @Field(() => [String])
     searchTerms: string[];
 
     @Field(() => VenueType)
     venueType: VenueType;
 
     @Field(() => AvailableHoursModel)
     openingHours: AvailableHoursModel;
 
     @Field(() => [MenuItemResponse], { nullable: true })
     menu?: MenuItemResponse[];
 
     @Field(() => PromotionModel, { nullable: true })
     promotion?: PromotionModel;
 
     @Field(() => IntGQl)
     public uploadValue: number;
 
     @Field(() => [VenueTagsResponse], { nullable: true })
     tags?: VenueTagsResponse[];
 
     @Field(() => GeometryModel)
     location: GeometryModel;
 
     @Field()
     address: string;
 
     @Field()
     postcode: string;
 
     @Field()
     contactNumber: string;
 
     @Field(() => [IntGQl])
     ratings: number[];
 
     @Field(() => FloatGQl)
     averageRating: number;
 
     @Field(() => FloatGQl)
     averagePrice(): number {
         if (!this.menu || this.menu.length === 0) {
             return 0;
         }
 
         // we would use reduce but can't, because menu isn't
         // an array of integers
         let sum = 0;
         for (let item of this.menu) {
             sum += item.price;
         }
 
         return sum / this.menu.length;
     }
 
     @Field(() => Boolean)
     isPromotion(@Arg("now") now: Date): boolean {
         if (!this.promotion)
             return false;
 
         if (this.promotion.startDate > now || now >  this.promotion.endDate)
             return false;
         
         return true;
     }
 }
 
 /**
  * @description
  * Response for either venue information or errors
  * based on venue searching
  * 
  * @field errors: an array of error strings [optional]
  * @field content: an array of venue responses [optional]
  */
 @ObjectType()
 export class VenueSearchResponse {
     @Field(() => [String], { nullable: true })
     errors?: string[];
 
     @Field(() => [VenueResponse], { nullable: true })
     content?: VenueResponse[];
 }
 
 /**
  * @description
  * Response for errors or resolved information
  * for a single venue
  * 
  * @field errors: an array of error strings [optional]
  * @field venueInformation: a venue response object [optional]
  */
 @ObjectType()
 export class VenueInfoResponse {
     @Field(() => [String], { nullable: true })
     errors?: string[];
 
     @Field(() => VenueResponse, { nullable: true })
     venueInformation?: VenueResponse;
     
 }