import { 
    Resolver, 
    Arg,
    Mutation,
    UseMiddleware,
    Query,
    Ctx
} from "type-graphql";
import center from '@turf/center';
import distance from '@turf/distance';
import { lengthToRadians } from "@turf/helpers";
import axios from "axios";

// middleware imports
import { Authorised } from "../../middleware/Authorised";

// entity imports
import {
    Venue,
    VenueModel
} from "../../entities/Venue";
import { RouteModel } from "../../entities/Route";
import { 
    Customer,
    Business
} from "../../entities/Users";

// resolver imports
import {
    UserType
} from '../users/users.constants';

// input type imports
import {
    RouteOptionsInput,
    SaveRouteInput,
} from "./routes.input";

// response imports
import { 
    RouteResponse,
    IncompleteRouteResponse
} from "./routes.response";

// local helper imports
import {
    dateInBetweenQuery,
    menuItemQuery,
    mergeVenueArrays,
    findRoute
} from "./routes.utils";

// constant imports
import {
    osrmServer
} from './routes.constants';

@Resolver()
export class RouteResolver {

    /**
     * @description
     * Generates a route based on inputted criteria
     * 
     * @param routeInput: input type with route search criteria (see inputs)
     * @returns an array of errors or the details of the generated route before saving
     */
    @Mutation(() => IncompleteRouteResponse)
    async generateRoute (
        @Arg("routeInput") routeInput: RouteOptionsInput
    ) {
        // First we validate our input data
        let venueCandidates: VenueModel[] = [];

        if (routeInput.radius && routeInput.radius <= 0) {
            return {
                "errors" : ["If set, the radius must be greater than 0"]
            };
        }

        if (!routeInput.requiredVenues && !routeInput.radius) {
            return {
                "errors" : ["You must set either a search location or a set of required venues"]
            };
        }

        // set some values we'll use for actually filtering venues
        let trueSearchCenter;
        let trueRadius = 0;
        if (routeInput.requiredVenues) {
            let locations = [];
            let venues: VenueModel[] = [];
            for (let venueID of routeInput.requiredVenues) {
                const venue = await Venue.findById(venueID);

                if (!venue) {
                    return {
                        "errors" : [`${venueID} is not a valid venue ID`]
                    }
                }
                locations.push(venue.location);
                venues.push(venue);
            }

            trueSearchCenter = center(
                {
                    "type" : "FeatureCollection",
                    "features" : venues.map(venue => (
                        {
                            "type" : "Feature",
                            "properties" : null,
                            "geometry" : venue.location
                        }
                    ))
                }
            ).geometry.coordinates;

            let maxDistance = 0;
            for (let location of locations) {
                const dist = distance(location.coordinates, trueSearchCenter) * 1000;
                if (dist > maxDistance) {
                    maxDistance = dist;
                }
            }

            // if the user specified a radius only allow it as the search radius
            // if it is greater than or equal to our max distance, otherwise throw
            // an error
            if (routeInput.radius && routeInput.radius < maxDistance) {
                return {
                    "errors" : ["Radius not large enough to encompass all required venues"]
                }
            }

            trueRadius = maxDistance;
            venueCandidates = venueCandidates.concat(venues);
        }

        // if we get to this point without errors then we want to use the
        // user-defined radius
        if (routeInput.radius) {
            trueRadius = routeInput.radius;
        }

        if (routeInput.searchCenter) {
            trueSearchCenter = routeInput.searchCenter;
        }

        if (routeInput.requiredVenues &&
            routeInput.minVenues &&
            (routeInput.requiredVenues.length > routeInput.minVenues)) {
            
            return {
                "errors" : ["The minimum venues must be greater than or equal to the selected venues"]
            }
        }

        // Now that we've validated our input we need to find venues
        // that match the criteria we've selected. We'll start with
        // date and location because these apply to all venues before
        // moving onto criteria, which are a little trickier.

        // first search for venues that are open at some point during our tour
        let dateQueries = [];
        for (let hourInc = 0; hourInc <= routeInput.maxTourTime; hourInc++) {
            const dateToCheck = new Date(
                new Date(routeInput.startTime).setHours(
                    routeInput.startTime.getHours() + hourInc
                )
            );
            dateQueries.push(dateInBetweenQuery(dateToCheck));
        }

        if (!trueSearchCenter) {
            return {
                "errors" : ["You must either select a location to search around or a set of required venues"]
            };
        }
        
        // filter by location now
        const locationQuery = {
            center: trueSearchCenter,
            radius: lengthToRadians(trueRadius, 'meters'),
            unique: true,
            spherical: true
        };

        let query = Venue.find();
        query.or(dateQueries);
        query.where('location').within(locationQuery);

        // get the final list of possible venues and then get a list of their
        // ids, as we need to access this data regularly
        venueCandidates = mergeVenueArrays(
            await query,
            venueCandidates
        );
        const venueIDs = venueCandidates.map(venue => venue._id.toString());

        if (venueCandidates.length === 0) {
            return {
                "errors" : ["There are no venues in this search radius within this date range"]
            };
        }
        
        if (routeInput.minVenues > venueCandidates.length) {
            return {
                "errors" : ["There are not enough venues to generate this route"]
            };
        }

        // finally filter by our venue criteria, this is another
        // or query any venue that matches one will be visitable
        let criteriaVenues: number[][] = [];
        if (routeInput.venueCriteria) {
            const err = "There are no venues meeting all criteria within your selected date and range";
            for (let criteria of routeInput.venueCriteria) {
                let criteriaQuery = {};
                if (criteria.menuItem) {
                    criteriaQuery = menuItemQuery(criteria.menuItem);
                } else if (criteria.minRating) {
                    criteriaQuery = {
                        "averageRating" : {
                            $gte : criteria.minRating
                        }
                    }
                } else if (criteria.venueTag) {
                    criteriaQuery = {
                        'tags.tag' : {
                            $all : [criteria.venueTag]
                        }
                    }
                }

                const venues = await Venue.find({})
                                          .or(dateQueries)
                                          .where(locationQuery)
                                          .where(criteriaQuery);
                if (!venues || venues.length === 0) {
                    return {
                        "errors" : [err]
                    }
                }

                const criterionVenueIDs = venues.map(venue => venue._id.toString());
                const criterionVenueIndexes = criterionVenueIDs.map(venueID => venueIDs.indexOf(venueID));

                criteriaVenues.push(criterionVenueIndexes);
            }
        }

        // Route generation logic

        // First we should start by generating a matrix representing a weighted, undirected
        // graph where the weights are the travel time between venues
        let durationMatrix: number[][];
        if (venueCandidates.length === 1) {
            // if we only have one venue candidate then we can't generate a table 
            // using a query and shouldn't try. instead we'll do some error checking
            // to see if the minimum venues are met and make our own (very simple)
            // table...
            durationMatrix = [[0]];
        } else {
            // ...otherwise we use OSRM to generate a matrix detailing the travel
            // times between all venues that may be in our route
            const coordinates = venueCandidates.map(
                venue => venue.location.coordinates.join(",")
            ).join(';');

            const tableRes = await axios.get(
                `${osrmServer}/table/v1/foot/${coordinates}`
            );

            if (tableRes.data && tableRes.data.code === "Ok") {
                durationMatrix = tableRes.data.durations;
                durationMatrix = durationMatrix.map(
                    row => row.map(
                        // convert from seconds to minutes
                        element => Math.round(element / 60)
                    )
                );
            } else {
                return {
                    "error" : ["We're very sorry, an unexpected occurred"]
                }
            }
        }

        // at this point generate a matrix to actually conduct our searches on
        // this uses information from the duration matrix but sorts it in order
        // of closest neighbours so there's less processing to do in the route
        // generation
        let searchMatrix: number[][][] = [];
        for (let venue = 0; venue < venueCandidates.length; venue++) {
            let neighbours: number[][] = [];
            for (let nextVenue = 0; nextVenue < venueCandidates.length; nextVenue++) {
                if (nextVenue === venue) {
                    continue;
                }

                neighbours.push([nextVenue, durationMatrix[venue][nextVenue]]);
            }
    
            // sorts the adjacent neighbours not in the path
            // to travel to the closest one first
            neighbours.sort((x, y) => (x[1] - y[1]));

            searchMatrix.push(neighbours);
        }

        let route: number[] = [];
        for (let start = 0; start < venueCandidates.length; start++) {
            let requiredVenues: number[] = [];
            if (routeInput.requiredVenues) {
                const requiredVenueIDs = venueIDs.filter(venueID => routeInput.requiredVenues!.includes(venueID));
                const requiredVenueIndexes = requiredVenueIDs.map(venueID => venueIDs.indexOf(venueID));
                requiredVenues = routeInput.requiredVenues ? requiredVenueIndexes : [];
            }

            // generate the route, this gives us a list of ordered venue ids
            const possibleRoute = await findRoute(
                searchMatrix,
                [start],
                venueIDs,
                0,
                routeInput.maxTourTime * 60,
                routeInput.timeAtVenue ? routeInput.timeAtVenue : 20,
                routeInput.startTime,
                routeInput.minVenues,
                routeInput.maxVenues,
                requiredVenues,
                false,
                criteriaVenues,
                false
            );

            if (possibleRoute.length === 0) {
                continue;
            } else {
                route = possibleRoute;
                break;
            }
        }

        if (route.length === 0) {
            return {
                "errors" : ["Could not find a route for these criteria"]
            };
        }
        
        // if the user (for some reason) set desired minimum venues to 1, and
        // we manage to fulfil this desire. return the single route and an empty
        // string. if we don't do this, the osrm call will crash.
        if (route.length === 1) {
            const singleVenue = await Venue.findById(venueCandidates[route[0]]._id);

            if (!singleVenue) {
                return {
                    "errors" : ["An unexpected error occurred"]
                };
            }
            
            return {
                content : {
                    venuesInRoute : [singleVenue.populate('tags.tag')],
                    routeGeometry : ""
                }
            };
        }
        
        // if the user did not have a minimum venue of 1, find a route joining
        // all our venues and return this, along with the list of venues in the
        // route
        const routeCoordinates = route.map(
            r => venueCandidates[r].location.coordinates.join(',')
        ).join(';');

        const routeRes = await axios.get(
            `${osrmServer}/route/v1/foot/${routeCoordinates}?overview=full`
        );

        if (routeRes.data && routeRes.data.code === 'Ok') {
            let realVenues = [];
            for (let venueIndex of route) {
                const venue = await Venue.findById(venueCandidates[venueIndex]);

                if (!venue) {
                    return {
                        "errors" : ["An unexpected error occurred"]
                    };
                }

                realVenues.push(await venue.populate('tags.tag'));
            }

            return {
                content : {
                    venuesInRoute : realVenues,
                    routeGeometry : routeRes.data.routes[0].geometry
                }
            }
        } else {
            return {
                errors : ["Could not find a route"]
            }
        }
    }

    /**
     * @description
     * Save a user's created route
     * 
     * @param route: input type for the route
     * @param jwtPayload: the user's jwt token
     * @returns the newly created route or error strings
     */
    @UseMiddleware(Authorised)
    @Mutation(() => RouteResponse)
    async saveRoute(
        @Arg("route") route: SaveRouteInput,
        @Ctx() { jwtPayload }: any
    ) {
        // extract the token data
        const { userID, userType } = jwtPayload;
        let user;

        // get the relevant user object
        switch (userType) {
            case UserType.CUSTOMER:
                user = await Customer.findById(userID);
                break;
            case UserType.BUSINESS:
                user = await Business.findById(userID);
                break;
            default:
                return {
                    "errors" : ["This type of user cannot save routes"]
                };
        }

        // typical null checks on user
        if (!userID || !user) {
            return {
                "errors" : ["This user does not exist"]
            }
        }

        // make the route in the db
        const newRoute = await (await RouteModel.create(route)).save();

        if (!newRoute) {
            return {
                "errors" : ["Failed to save this route"]
            }
        }
        
        // add the route to the user
        if (!user.myRoutes) {
            user.myRoutes = [newRoute];
        } else {
            user.myRoutes.push(newRoute);
        }

        await user.save();

        // populate the return value
        const populatedNewRoute = await RouteModel.findById(newRoute._id).populate("venuesInRoute");
        return {
            "content" : populatedNewRoute
        };
    }

    /**
     * @description
     * Edit a generated, unsaved route
     * 
     * @param venues: ids of the venues to appear in the edited route
     * @returns an incomplete route that has not been saved
     */
    @Query(() => IncompleteRouteResponse)
    async editRoute(
        @Arg("venueIDs", () => [String]) venueIDs: string[]
    ) {
        // get the venues in the route
        let venues = [];
        for (let venueID of venueIDs) {
            const venue = await Venue.findById(venueID);

            if (!venue) {
                return {
                    "errors" : [`There is no venue with the ID ${venueID}`]
                };
            }

            venues.push(await venue.populate('tags.tag'));
        }

        if (venues.length === 1) {
            return {
                content : {
                    venuesInRoute : venues,
                    routeGeometry : ""
                }
            };
        } else {
            // obtain the route coordinates
            const routeCoordinates = venues.map(
                venue => venue.location.coordinates.join(',')
            ).join(';');

            // make a call to the osrm server to find 
            // the fastest route between all the venues
            // present in the route
            const routeRes = await axios.get(
                `${osrmServer}/route/v1/foot/${routeCoordinates}?overview=full`
            );

            // return the route or errors
            if (routeRes.data && routeRes.data.code === 'Ok') {
                return {
                    content : {
                        venuesInRoute : venues,
                        routeGeometry : routeRes.data.routes[0].geometry
                    }
                };
            } else {
                return {
                    errors : ["Could not find a route"]
                };
            }
        }
    }


    /**
     * @description
     * Find a route by it's ID
     * 
     * @param routeID: the route's ID 
     * @returns a route on success, an array of
     *          error strings on failure
     */
    @UseMiddleware(Authorised)
    @Query(() => RouteResponse)
    async getRouteByID(
        @Arg("routeID") routeID: string
    ) {
        // find the route in the database
        const route = await RouteModel.findById(routeID);
        if (!route) return {errors: ["An error occurred"]};

        let venueModels = [];
        for (let venueID of route.venuesInRoute) {
            const venue = await Venue.findById(venueID);

            if (!venue) {
                return {
                    "errors" : ["An error occurred"]
                };
            }

            venueModels.push(await venue.populate('tags.tag'));
        }

        return {
            content: {
                ...route.toObject(),
                venuesInRoute : venueModels
            }
        };
    }

}