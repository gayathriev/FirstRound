import { 
    Field,
    ObjectType,
    ID,
    Int as IntGQl
} from "type-graphql";

// entity imports
import { VenueModel } from '../../entities/Venue';
import { VenueResponse } from "../venues/venues.response";

/**
 * @description
 * A populated return type for routes
 * 
 * @field _id: the route ID
 * @field name: the name of the route
 * @field venuesInRoute: the venues that appear in the route in the order
 * that they are visited
 * @field routeGeometry: a polyline string describing the route
 */
@ObjectType()
export class PopulatedRouteResponse  {

    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field(() => [VenueResponse])
    venuesInRoute: VenueResponse[];

    @Field()
    routeGeometry: string;
}

/**
 * @description
 * A return type for routes
 * 
 * @field errors: an array of error strings [optional]
 * @field content: a route object on successful route generation [optional]
 */
@ObjectType()
export class RouteResponse  {

    @Field(() => [String], { nullable: true })
    errors?: string[];

    @Field(() => PopulatedRouteResponse, { nullable: true })
    content?: PopulatedRouteResponse;
}

/**
 * @description
 * A return type for routes that have not been saved
 * 
 * @field venuesInRoute: the venues that appear in the route in the order
 * that they are visited
 * @field routeGeometry: a polyline string describing the route
 */
@ObjectType()
export class IncompleteRoute {

    @Field(() => [VenueResponse])
    venuesInRoute: VenueResponse[];

    @Field()
    routeGeometry: string;
}

/**
 * @description
 * A return type for routes that have been generated but not saved
 * to the database.
 * 
 * @field errors: an array of error strings [optional]
 * @field content: an array containing the segments that build up a route [optional]
 */
@ObjectType()
export class IncompleteRouteResponse {
    
    @Field(() => [String], { nullable: true })
    errors?: string[];

    @Field(() => IncompleteRoute, { nullable: true })
    content?: IncompleteRoute;
}