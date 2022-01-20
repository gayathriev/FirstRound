// entity imports
import {
    Venue,
    VenueModel
} from '../../entities/Venue';

// resolver imports
import { 
    generateFuzzySearchQuery
} from "../venues/venues.utils";

// input type imports
import {
    MenuSearchInput
} from '../menus/menus.input';

/**
 * @description
 * Function to generate a MongoDB database query
 * to check whether a venue is open on a certain date
 * 
 * @param date: a date object
 * @returns a MongoDB query
 * 
 * @notes
 * since we have the free-version of mongodb, we are not able to perform server-side scripting
 * and hence have to format our queries like this
 */
export const dateInBetweenQuery = (date: Date): any => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // return a mongodb query
    return {
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
                                        $eq : ["$$workday.day", days[date.getDay()]]
                                    },
                                    {
                                        $or : [
                                            {
                                                $gt : [date.getHours(), "$$workday.open.hours"]
                                            },
                                            {
                                                $and : [
                                                    { 
                                                        $eq : [date.getHours(), "$$workday.open.hours"]
                                                    },
                                                    {
                                                        $gte : [date.getMinutes(), "$$workday.open.minutes"]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $or : [
                                            {
                                                $lt : [date.getHours(), "$$workday.close.hours"]
                                            },
                                            {
                                                $and : [
                                                    { 
                                                        $eq : [date.getHours(), "$$workday.close.hours"]
                                                    },
                                                    {
                                                        $lte : [date.getMinutes(), "$$workday.close.minutes"]
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
    };
}

/**
 * @description
 * Generate a MongoDB for whether a menu item is
 * in a venue's menu
 * 
 * @param item: the menu item to search for
 * @returns a MongoDB query
 */
export const menuItemQuery = (item: MenuSearchInput): any => {
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

    return {
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
    };
}

/**
 * @description
 * Merge 2 venue model arrays into one another
 * 
 * @param into one array to merge into
 * @param from the other array to merge from
 * @returns the merged array
 */
export const mergeVenueArrays = (into: VenueModel[], from: VenueModel[]): VenueModel[] => {
    let venuesToAdd = [];
    for (let venueA of from) {

        let add = true;
        for (let venueB of into) {

            if (venueB._id.toString() === venueA._id.toString()) {
                add = false;
                break;
            }
        }

        if (add) venuesToAdd.push(venueA);
    }

    return into.concat(venuesToAdd);
}

/**
 * @description
 * Checks whether or not a venue is open at a certain time
 * 
 * @param venueID: the ID of the venue
 * @param time: the time to check against
 * @returns a boolean
 */
const venueOpenAtTime = async (venueID: String, time: Date) => {
    const venue = await Venue.findById(venueID);
    if (!venue) return false;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[time.getDay()];

    for (let hours of venue.openingHours.hours) {
        if (hours.day !== currentDay) continue;

        if (hours.open.hours > time.getHours() ||
            (hours.open.hours == time.getHours() && hours.open.minutes > time.getMinutes())) 
            continue;

        if (hours.close.hours < time.getHours() ||
            (hours.close.hours == time.getHours() && hours.close.minutes < time.getMinutes()))
            continue;
    
        
        return true;
    }

    return false;
}

/**
 * @description
 * Attempts to generate a route meeting
 * a given user-inputted criteria
 * 
 * @param durationMatrix: matrix with travel durations
 * @param currentPath: current generated route 
 * @param allVenues: all the venues that may appear in thr route 
 * @param timeElapsed: amount of time that current path takes 
 * @param maxTime: maximum time for a route to take 
 * @param averageTime: average time the user will spend at venue
 * @param startTime: desired start time
 * @param minVenues: minimum venues in a route 
 * @param maxVenues: maximum venues in a route 
 * @param requiredVenues: venues that must appear in the route 
 * @param requiredMet: whether or not current path includes all
 *                     required venues 
 * @param criteriaVenues:  Array of array of venues in which inclusion 
 *                         in current path meets a criterion 
 * @param criteriaMet: whether user-inputted criteria has been met 
 * @returns 
 */
export const findRoute = async (
    searchMatrix: number[][][],
    currentPath: number[],
    allVenues: String[],
    timeElapsed: number,
    maxTime: number,
    averageTime: number,
    startTime: Date,
    minVenues: number,
    maxVenues: number,
    requiredVenues: number[],
    requiredMet: boolean,
    criteriaVenues: number[][],
    criteriaMet: boolean
): Promise<number[]> => {
    const currentVenue = currentPath.length - 1;
    
    // Check if the venue is closed at the current time, if it is
    // we need to backtrack
    const currentTime = new Date(
        new Date(startTime).setMinutes(startTime.getMinutes() + timeElapsed)
    );
    if (!(await venueOpenAtTime(allVenues[currentPath[currentVenue]], currentTime))) {
        return [];
    }

    // check if we've gone over the max time, if we have backtrack
    if (timeElapsed > maxTime) {
        return [];
    }

    // Check if we are at the max time allowed, if we are not yet
    // between the minimum and maximum venues backtrack
    if (timeElapsed == maxTime && currentPath.length < minVenues) {
        return [];
    }

    // If we are greater than the minimum venues, check if we meet the
    // conditions necessary and return if we do. At the same time store
    // whether or not we meet the conditions so we don't have to perform
    // a costly check in later paths
    let rMet = requiredMet;
    let cMet = criteriaMet;
    if (currentPath.length >= minVenues) {
        if (!rMet) {
            // check that every required venue is in currentPath
            rMet = true;
            for (let required of requiredVenues) {
                if (!currentPath.includes(required)) {
                    rMet = false;
                    break;
                }
            }
        }

        if (!cMet) {
            // check that at least one venue is in the path 
            // that meets a criterion for all criteria
            cMet = true;
            // console.log(criteriaVenues);
            for (let criteria of criteriaVenues) {
                let criteriaFound = false;
                for (let venue of criteria) {
                    if (currentPath.includes(venue)) {
                        criteriaFound = true;
                        break;
                    }
                }
                if (!criteriaFound) {
                    cMet = false;
                    break;
                }
            }
        }

        if (rMet && cMet) {
            return currentPath;
        }
    }

    // If we are at the maximum venues or the maximum time and get here
    // then we don't meet the conditions and should backtrack
    if (currentPath.length === maxVenues || timeElapsed >= maxTime) {
        return [];
    }

    const neighbours: number[][] = searchMatrix[currentVenue];
    // recursively call the function
    for (let [nextVenue, duration] of neighbours) {
        if (currentPath.includes(nextVenue)) {
            continue;
        }

        const route = await findRoute(
            searchMatrix,
            [...currentPath, nextVenue],
            allVenues,
            timeElapsed + averageTime + duration,
            maxTime,
            averageTime,
            startTime,
            minVenues,
            maxVenues,
            requiredVenues,
            rMet,
            criteriaVenues,
            cMet
        );

        if (route.length === 0) {
            continue;
        } else {
            return route;
        }
    }

    return [];
}