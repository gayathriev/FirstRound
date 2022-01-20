import { 
    InputType, 
    Field,
    Int as IntGQl,
    Float as FloatGQl
} from "type-graphql";
import { lengthToRadians } from "@turf/helpers";

// entity imports
import { 
    Venue,
    VenueType
} from "../../entities/Venue";

// resolver imports
import {
    AvailableHoursInput,
} from "../../shared-resources/inputs/timemodels.input";
import {
    MenuSearchInput,
    AddMenuItemInput
} from "../menus/menus.input";
import { PromotionInput } from "../promotions/promotions.input";

// local helper imports
import { generateFuzzySearchQuery } from "./venues.utils";

/**
 * @description
 * Input type representing the opening hours of a venue
 * 
 * @field day: the day that the venue is open
 * @field open: the hours and minutes the venue opens, represented as a length two array
 * @field open: the hours and minutes the venue closes, represented as a length two array
 */
@InputType()
export class HoursInput {
    @Field()
    day: string;

    @Field(() => [IntGQl])
    open: number[];

    @Field(() => [IntGQl])
    close: number[];
}

/**
 * @description
 * Input type representing a venue's current tags with a set count
 * 
 * @field tag: the tag string ("cocktail" etc.)
 * @field count: the number of times users have selected
 *               this particular tag [optional - db population]
 */
@InputType()
export class VenueTagsInput {
    @Field()
    tag: string;

    @Field(() => IntGQl, { nullable: true })
    count?: number;
}

/**
 * @description
 * Input type for creating a GeoJSON object representing data on a map
 * 
 * @field type: GeoJSON type of the geometry object
 * @field coordinates: Longitude and latitude of the point on the Earth
 */
@InputType()
export class GeometryInput {
    @Field()
    type: string

    @Field(() => [FloatGQl])
    coordinates: number[]
}

/**
 * @description
 * Input type to add a new venue
 * 
 * @field name: the venue name
 * @field venueType: the type of the venue (bar, cafe, restaurant)
 * @field openingHours: opening hours for each day in the week
 * @field menu: an array of new menu items [optional]
 * @field promotion: new promotion data [optional]
 * @field reviews: an array of star ratings [optional]
 * @field tags: a list of venue tags [optional]
 * @field location: the coordinates of the venue
 * @field address: the address of the venue
 * @field postcode: the venue postcode
 * @field contactNumber: the venue's phone number
 */
@InputType()
export class AddVenueInput {
    @Field()
    name: string;

    @Field(() => VenueType)
    venueType: VenueType;

    @Field()
    openingHours: AvailableHoursInput;

    @Field(() => [AddMenuItemInput], { nullable: true })
    menu?: AddMenuItemInput[];

    @Field(() => PromotionInput, { nullable: true })
    promotion?: PromotionInput;

    @Field(() => [IntGQl], { nullable: true })
    reviews?: number[];

    @Field(() => [VenueTagsInput], { nullable: true })
    tags?: VenueTagsInput[];

    @Field(() => GeometryInput)
    location: GeometryInput;

    @Field()
    address: string;

    @Field()
    postcode: string;

    @Field()
    contactNumber: string;
}

/**
 * @description
 * Search input for location
 * 
 * @field searchCenter: middle point of location search
 * @field radius: radius of location search circle (in metres)
 */
@InputType()
class LocationSearchInput {
    @Field(() => [FloatGQl])
    searchCenter: number[];

    @Field(() => FloatGQl)
    radius: number;
}

/**
 * @description
 * Input type for advanced searching
 * 
 * @field basicSearch: a basic search string [optional]
 * @field name: the venue name [optional]
 * @field location: location search input [optional]
 * @field venueType: venue type (bar, cafe, restaurant) [optional]
 * @field venueTags: an array of venue tags [optional]
 * @field menuItems: an array of menu items [optional]
 * @field openNow: current date-time to test against opening hours [optional]
 * @field promotionNow: current date-time to test against promotion [optional]
 * @field minRating: minimum rating for the venue [optional]
 */
@InputType()
export class SearchInput {

    @Field(() => String, { nullable: true })
    basicSearch?: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => LocationSearchInput, { nullable: true })
    location?: LocationSearchInput;

    @Field(() => VenueType, { nullable: true })
    venueType?: VenueType;

    @Field(() => [String], { nullable: true })
    venueTags?: string[];

    @Field(() => [MenuSearchInput], { nullable: true })
    menuItems?: MenuSearchInput[];

    @Field({ nullable: true })
    openNow?: Date;

    @Field({ nullable : true })
    promotionNow?: Date;

    @Field({ nullable: true })
    minRating?: number;

    /**
     * @description
     * Builds a MongoDB query from supplied search criteria
     * 
     * @returns a MongoDB query
     * 
     * @note
     * Mongodb free version does not allow server-side scripting
     * so we have to format the db query like this
     * If we had the paid version of MongoDB, we could refactor
     * for cleaner code
     */
    get asQuery () {
        let query = Venue.find();

        if (this.basicSearch) {
            const searchRegex = new RegExp(`${this.basicSearch}`, 'i');
            query.or([
                {
                    $expr : generateFuzzySearchQuery("$searchTerms", this.basicSearch)
                },
                {
                    $expr : {
                        $gt : [
                            {
                                $size : {
                                    $filter : {
                                        input: "$menu.searchTerms",
                                        cond: generateFuzzySearchQuery("$$this", this.basicSearch)
                                    }
                                }
                            },
                            0
                        ]
                    }
                },
                {'address' : searchRegex},
            ]);
        }

        let nameQuery = null;
        if (this.name) {
            nameQuery = {
                $expr : generateFuzzySearchQuery("$searchTerms", this.name)
            };
        }

        let itemQueries: any[] = [];
        if (this.menuItems) {
            for (let item of this.menuItems) {
                
                // do a fuzzy search for the menu item, may or may not have a price
                let searchConds = [];

                if (item.itemName) {
                    searchConds.push(generateFuzzySearchQuery("$$item.searchTerms", item.itemName));
                }
                
                if (item.price) {
                    searchConds.push(
                        { 
                            $lte : [
                                "$$item.price",
                                item.price
                            ]
                        }
                    );
                }

                if (item.itemKind) {
                    searchConds.push(
                        {
                            $eq : [
                                "$$item.itemKind",
                                {
                                    $toObjectId : item.itemKind
                                }
                            ]
                        }
                    )
                }

                if (item.isSpecial) {
                    searchConds.push(
                        {
                            $eq : [
                                "$$item.isSpecial",
                                item.isSpecial
                            ]
                        }
                    )
                }

                itemQueries.push({
                    $expr : {
                        $gt : [
                            { 
                                $size : {
                                    $filter : {
                                        input: "$menu",
                                        as:"item",
                                        cond: {
                                            $and : searchConds
                                        }
                                    }
                                }
                            },
                            0
                        ]
                    }
                });
            }
        }

        // applies a venue name query, menu item query
        // or both at once
        if (nameQuery && itemQueries.length > 0) {
            query.where({
                $and : [
                    nameQuery,
                    { $and : itemQueries }
                ]
            });
        } else if (nameQuery) {
            query.where(nameQuery);
        } else if (itemQueries.length > 0) {
            query.find({
                $and : itemQueries
            });
        }

        if (this.location) {
            query.where('location').within({
                center: this.location.searchCenter,

                // we expect the radius in m; need to convert to km
                // and then divide by the earth's radius
                radius: lengthToRadians(this.location.radius, 'meters'),
                unique: true,
                spherical: true
            });
        }

        if (this.venueTags) {
            query.where('tags.tag', {
                $all : this.venueTags
            });
        }

        if (this.venueType) {
            query.where('venueType', this.venueType);
        }

        if (this.openNow) {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            // is a venue open at a specific date?
            query.where({
                $expr : {
                    $gt : [
                        {
                            $size : {
                                $filter : {
                                    input: "$openingHours.hours",
                                    as: "workday",
                                    cond: {
                                        $and : [
                                            {
                                                $eq : ["$$workday.day", days[this.openNow.getDay()]]
                                            },
                                            {
                                                $or : [
                                                    {
                                                        $gt : [this.openNow.getHours(), "$$workday.open.hours"]
                                                    },
                                                    {
                                                        $and : [
                                                            { 
                                                                $eq : [this.openNow.getHours(), "$$workday.open.hours"]
                                                            },
                                                            {
                                                                $gte : [this.openNow.getMinutes(), "$$workday.open.minutes"]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                $or : [
                                                    {
                                                        $lt : [this.openNow.getHours(), "$$workday.close.hours"]
                                                    },
                                                    {
                                                        $and : [
                                                            { 
                                                                $eq : [this.openNow.getHours(), "$$workday.close.hours"]
                                                            },
                                                            {
                                                                $lte : [this.openNow.getMinutes(), "$$workday.close.minutes"]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        0
                    ]
                }
            })
        }

        // whether or not a venue has a current promotion
        if (this.promotionNow) {
            query.where({
                $and : [
                    {
                        "promotion.startDate" : { 
                            $lte : this.promotionNow
                        }
                    },
                    {
                        "promotion.endDate" : { 
                            $gte : this.promotionNow
                        }
                    }
                ]
            });
        }

        // does it meet the minimum average rating?
        if (this.minRating) {
            query.where('averageRating', 
                {
                    $gte: this.minRating
                }
            );
        }
 
        return query;
    }
}