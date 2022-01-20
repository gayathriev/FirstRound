import {
    Resolver,
    Query,
    Mutation,
    ID,
    Arg,
    UseMiddleware,
    Ctx,
    Float as FloatGQl,
} from 'type-graphql'
import { AppContext } from "../../shared-resources/utils/app.context";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { AdminRoute } from "../../middleware/AdminRoute";
import { isBusiness } from "../../middleware/isBusiness";

// entity imports
import { 
    VenueRequestModel,
    RequestStatus
} from "../../entities/VenueRequest";
import { Venue } from "../../entities/Venue";
import { Business } from "../../entities/Users";

// resolver imports
import { VenueResponse } from "../venues/venues.response";

// response imports
import { VenueRequestResponse } from "./venue-requests.response";

// local helper imports
import { generateResponses } from "./venue-requests.utils";
import { sendVerificationUpdate } from '../../shared-resources/utils/mailer';



const badRequestMsg = "Bad request for upload: check venue and user and try again";



@Resolver()
export class VenueRequestsResolver {

    /**
     * @description
     * Query that takes in token and 
     * returns list of verified businesses
     * 
     * @param jwtPayload: the user's JWT token
     * @returns an array of venue's owned by the business user
     */
    @UseMiddleware(Authorised, isBusiness)
    @Query(() => [VenueResponse])
    async getVenuesForSelf(
        @Ctx() { jwtPayload }: AppContext,
    ) {
        
        // typical null checks and extract business
        if (!jwtPayload) return [];
        const businessUser = await Business.findById(jwtPayload.userID);
        if (!businessUser) return [];
        if (!businessUser.verifiedVenues) return [];

        // loop through stored venue ids and resolve the venues
        let venueList = [];

        for (var venueID of businessUser.verifiedVenues) {
            let venue = await Venue.findById(venueID).populate(["tags.tag", "menu.itemKind"]);
            if (venue) venueList.push(venue.toObject());
        }

        return venueList;
    }

    /**
     * @description
     * Get all unprocessed venue requests
     * for the admin dashboard
     * 
     * @returns an array of venue requests
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Query(() => [VenueRequestResponse])
    async getVenueRequests() {
        const venueRequests = await VenueRequestModel.find({});
        return (await generateResponses(venueRequests));
    }

    /**
     * @description
     * Query that takes in the user's token and 
     * a request status and returns a list of 
     * all their venue requests with that status
     * 
     * @param jwtPayload: the user's JWT token
     * @param status: the request status (approved, denied or pending)
     * @returns an array of the user's venue requests with that status
     */
    @UseMiddleware(Authorised, isBusiness)
    @Query(() => [VenueRequestResponse])
    async getMyRequestsByStatus(
        @Ctx() { jwtPayload }: AppContext,
        @Arg("status") status: RequestStatus,
    ) { 
        // typical null checks and extract business
        if (!jwtPayload) return [];
        const myID = jwtPayload.userID;

        const myRequests = await VenueRequestModel.find({ claimant: myID, status });

        if (!myRequests) return [];
        else return (await generateResponses(myRequests));
    }

    /**
     * @description
     * An admin query that returns a list of 
     * all user's venue requests with a given status
     * 
     * @param status: the request status (approved, denied or pending)
     * @returns an array of venue requests with that status
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Query(() => [VenueRequestResponse])
    async getRequestsByStatus(
        @Arg("status", () => RequestStatus) status: RequestStatus, 
    ) {
        const venueRequests = await VenueRequestModel.find({ status });
        return (await generateResponses(venueRequests));
    }

    /**
     * @description
     * Find the percent of processed venue requests on the system
     * 
     * @returns percentage of processed venue requests
     */
    @Query(() => FloatGQl)
    async getProcessedRequests() {
        const allRequests = (await VenueRequestModel.find({})).length;
        // avoid divide by zero error
        if (allRequests === 0) return 0;

        const pendingRequests = (await VenueRequestModel.find({})).length;

        return ((allRequests - pendingRequests) / (allRequests)) * 100;
    }

    /**
     * @description
     * An admin mutation to process venue requests
     * 
     * @param requestID: the venue request ID
     * @param decision: the request outcome status (approved, denied or pending)
     * @param comment: an optional comment from the admin
     * @returns an empty array or an array of errors
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Mutation(() => [String])
    async processRequest(
        @Arg("requestID", () => ID) requestID: string,
        @Arg("decision", () => RequestStatus) decision: RequestStatus,
        @Arg("comment", { nullable: true }) comment?: string,
    ) {
        try {
            const updated = (await VenueRequestModel.findByIdAndUpdate(
                requestID,
                { status: decision },
            ));

            if (!updated) return ["Could not find a venue with this ID."];
            
            if (comment) {
                await updated!.update({ reasonForRejection: comment });
            }

            if (decision === RequestStatus.APPROVED) {

                // get the business user
                const businessUser = await Business.findById(updated.claimant);

                // get their verified venues (ternary to check businessUser exists)
                let savedVenues = (businessUser) ? businessUser.verifiedVenues : null;

                // send status update email to business
                sendVerificationUpdate(businessUser!.email);

                // check the venue is not already verified for the businessUser
                if (savedVenues && (savedVenues.indexOf(updated.venue) === -1)) {
        
                    // make the push
                    const update = (await Business.findByIdAndUpdate(
                        updated.claimant,
                        { $push: { verifiedVenues: [updated.venue] }},
                    ));
                }

            }

            return [];
        } catch (err) {
            // this should realistically never happen, but it's best
            // to be safe
            console.log(err);
            return ["Could not find a venue with this ID."];
        }
    }

}


