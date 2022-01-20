import { 
    InputType, 
    Field,
    Int as IntGQl,
    Float as FloatGQl,
    ID
} from "type-graphql";

// entity imports
import { VenueType } from '../../entities/Venue';

// resolver imports
import { MenuSearchInput } from '../menus/menus.input';

/**
 * @description
 * An input type for receiving venue search criteria
 * 
 * @field venueTags: a venue tag [optional]
 * @field menuItems: an array of menu item searches [optional]
 * @field minRating: the minimum rating for a venue [optional]
 */
@InputType()
class VenueCriteria {

    @Field({ nullable: true })
    venueTag?: string;

    @Field(() => MenuSearchInput, { nullable: true })
    menuItem?: MenuSearchInput;

    @Field({ nullable: true })
    minRating?: number;
}

/**
 * @description
 * An input type for generating routes with a given criteria
 * 
 * @field requredVenues: a list of venue IDs to be in the route [optional]
 * @field startTime: start date and time for the route
 * @field maxTourTime: total time (in hours) that the route may take
 * @field searchCenter: location around which to search if no venues are required [option]
 * @field radius: radius within which to search (in metres) [optional]
 * @field minVenues: minimum number of venues to visit
 * @field maxVenues: maximum number of venues to visit
 * @field timeAtVenue: time in hours to spend at each venue [optional]
 * @field venueCriteria: additional search criteria for venues [optional]
 */
@InputType()
export class RouteOptionsInput {
    @Field(() => [ID], { nullable: true })
    requiredVenues?: string[];

    @Field()
    startTime: Date;

    @Field(() => IntGQl)
    maxTourTime: number;

    @Field(() => [FloatGQl], { nullable: true })
    searchCenter?: number[];

    @Field(() => IntGQl, { nullable: true })
    radius?: number;

    @Field(() => IntGQl, { nullable: true })
    minVenues: number;

    @Field(() => IntGQl, { nullable: true })
    maxVenues: number;

    @Field(() => IntGQl, { nullable: true })
    timeAtVenue?: number;

    @Field(() => [VenueCriteria], { nullable: true })
    venueCriteria?: VenueCriteria[];
}

/**
 * @description
 * The input for saving routes in the db
 * 
 * @field name: name of the route
 * @field venuesInRoute: an array of venue names in the route
 * @field routeGeometry: a Google encoded polyline for
 *                       storing sequential map points
 */
@InputType()
export class SaveRouteInput {
    @Field()
    name: string;

    @Field(() => [String])
    venuesInRoute: string[];

    @Field()
    routeGeometry: string;
}