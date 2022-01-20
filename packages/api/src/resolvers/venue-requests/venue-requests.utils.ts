// entity imports
import { 
    VenueRequestSchema,
    VenueRequestModel,
    RequestStatus
} from "../../entities/VenueRequest";
import {  Venue } from "../../entities/Venue";
import { Business } from "../../entities/Users";

// response imports
import { VenueRequestResponse } from "./venue-requests.response";


/**
 * @description
 * A helper function to convert the response we get from
 * the db into a model we can work with more easily
 * 
 * @param requests: an array of venue requests
 * @returns an array of formatted venue request results
 */
 export const generateResponses = async (requests: VenueRequestSchema[]) => {

    // error checking just in case the IDs point to non-existent documents
    let results:VenueRequestResponse[] = [];
    for (var venueRequest of requests) {
        let venue;
        try {
            venue = await Venue.findById(venueRequest.venue);
        } catch (err) {
            console.log(err);
            continue;
        }

        let claimant;
        try {
            claimant = await Business.findById(venueRequest.claimant);
        } catch (err) {
            console.log(err);
            continue;
        }

        // null checks for typescript (should be caught
        // by try catch above)
        if (!venue || !claimant) continue;

        if (!venueRequest.reasonForRejection) {
            results.push({
                _id: venueRequest._id,
                verificationDocuments: venueRequest.verificationDocuments,
                status: venueRequest.status,
                venue,
                claimant
            });
        } else {
            results.push({
                _id: venueRequest._id,
                verificationDocuments: venueRequest.verificationDocuments,
                status: venueRequest.status,
                reasonForRejection: venueRequest.reasonForRejection,
                venue,
                claimant,
            });
        }
    }

    return results;
}


/**
 * @description
 * Upload a venue verification request
 * for a given user and venue
 * 
 * @param verificationDocuments: url to verification documents
 * @param venueID: the ID of the venue
 * @param jwtPayload: the user's JWT token
 * @returns boolean to indicate success
 */
export async function createVerificationRequest (
    verificationDocuments: string,
    venueID: string,
    jwtPayload : any
) {
    // extract the user id from jwtPayload
    // check the venue exists - check by id
    const venue = await Venue.findById(venueID);
    const business = await Business.findById(jwtPayload.userID);
    
    // make a check in case input is corrupted
    if  (!venue || !business) {
        return false;
    } else {
        // create a new VenueRequest in db with this info
        const newVenueRequest = await (await VenueRequestModel.create({
            venue: venueID,
            claimant: jwtPayload.userID,
            status: RequestStatus.PENDING,
            verificationDocuments: verificationDocuments
        })).save();

        return true;
    }
}