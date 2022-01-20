import { 
    Resolver, 
    Query, 
    Arg,
    Mutation, 
    Ctx,
    UseMiddleware
} from "type-graphql";

// middleware imports
import { Authorised } from "../../middleware/Authorised";

// entity imports
import {
    VenueModel,
    Venue,
    VenueTags,
    VenueTagsModel
} from "../../entities/Venue";

// helper function imports
import {
    generateNGrams,
} from '../../shared-resources/utils/fuzzy-searching';

// input type imports
import {
    AddVenueInput,
    HoursInput,
    SearchInput
} from "./venues.input";

// response imports
import { 
    VenueResponse,
    VenueTagsResponse,
    VenueSearchResponse,
    VenueInfoResponse,
    TagResponse
} from "./venues.response";

// constant imports
import {
    noVenueMatch,
    noMenuItems,
    noVenuesError
} from "./venues.constants";


@Resolver(() => VenueResponse)
export class VenueResolver {
    /**
     * @description
     * Register a new venue to the system
     * 
     * @param venueData: information about the new venue 
     * @returns the newly created venue object
     */
    @Mutation(() => VenueModel)
    async registerVenue (
        @Arg("newVenueData") venueData: AddVenueInput,
    ) {
        const newVenue = await (await Venue.create(venueData)).save();

        const finalVenue = await Venue.findByIdAndUpdate(
            newVenue._id,
            {
                searchTerms: generateNGrams(newVenue.name),
            },
            {
                returnDocument: 'after',
            }
        );

        // generate Ngrams for misspelled venue name searching
        // add these to venue objects
        if (finalVenue?.menu) {
            finalVenue.menu.forEach(async (item) => {
                console.log(item, generateNGrams(item.name));
                await Venue.findOneAndUpdate(
                    {
                        "menu._id" : {
                            $all : item._id
                        }
                    },
                    {
                        $set : {
                            "menu.$.searchTerms": generateNGrams(item.name),
                        }
                    }
                );
                const newMenuItem = await Venue.find({
                    "menu._id" : {
                        $all : item._id
                    }
                }).exec();
            });
        }

        return finalVenue;
    }

    /**
     * @description
     * Mutation to add a new venue tag
     * to the system
     * @param text: text for the tag 
     * @returns the newly created venue tag
     */
    @Mutation(() => VenueTagsModel)
    async registerVenueTag (
        @Arg("text") text: String,
    ) {
        const newVenueTag = (await VenueTags.create({ text })).save();

        return newVenueTag;
    }

    /**
     * @description
     * Add a given tag to the venue
     * 
     * @param tagID: the ID of the tag to add 
     * @param venueID: the ID of the venue
     * @param jwtPayload: the user's JWT token
     * @returns the venue with the populated tag on success
     */
    @UseMiddleware(Authorised)
    @Mutation(() => VenueResponse)
    async addVenueTag (
        @Arg("tagID") tagID: string,
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any
    ) {
        const tag = await VenueTags.findById(tagID).exec();
        if (!tag) return;

        const { userID } = jwtPayload;

        let venue;
        if (await Venue.exists({ "_id" : venueID, "tags.tag" : tagID})) {
            // if the venue already has a tag, just update the count
            venue = await Venue.findOneAndUpdate(
                {
                    "_id" : venueID,
                    "tags.tag" : {
                        $all : tagID
                    }
                },
                {
                    $inc : {
                        "tags.$.count" : 1
                    },
                    $push : {
                        "tags.$.taggers" : userID
                    }
                },
                {
                    returnDocument: 'after',
                }
            );
        } else if (await Venue.exists({ "_id" : venueID}), false) {
            // if the venue does not exist throw an error
            return;
        } else {
            // if the tag does not exist for this venue, add it
            venue = await Venue.findByIdAndUpdate(venueID, 
                {
                    $push : {
                        tags: {
                            tag: tagID,
                            count: 1,
                            taggers: [userID]
                        }
                    },
                },
                {
                    returnDocument: 'after',
                }
            );
        }

        if (!venue) return;

        return (await venue.populate('tags.tag')).toObject();
    }

    /**
     * @description
     * Remove a tag from a given venue
     * 
     * @param tagID: the ID of the tag to remove 
     * @param venueID: the venue ID
     * @param jwtPayload: the user's JWT TOKEN
     * @returns the updated venue data on success
     */
    @UseMiddleware(Authorised)
    @Mutation(() => VenueResponse)
    async removeVenueTag (
        @Arg("tagID") tagID: string,
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any
    ) {
        const tag = await VenueTags.findById(tagID).exec();
        if (!tag) return;

        const { userID } = jwtPayload;

        await Venue.findOneAndUpdate(
            {
                "_id" : venueID,
                "tags.tag" : {
                    $all : tagID
                }
            },
            {
                $inc : {
                    "tags.$.count" : -1
                },
                $pull : {
                    "tags.$.taggers" : userID
                }
            },
            
        );

        // now remove the tag entirely if the count has become 0
        const venue = await Venue.findByIdAndUpdate(venueID,
            {
                $pull : {
                    "tags" : {
                        "count" : 0
                    }
                }
            },
            {
                returnDocument: 'after',
            }
        );
        
        if (!venue) return;
        return (await venue.populate('tags.tag')).toObject();
    }

    /**
     * @description
     * Get all the tags for a given venue
     * 
     * @param venueID: the venue's ID 
     * @param jwtPayload: the user's JWT token
     * @returns an array of venue tags associated
     *          with the inputted venueID
     */
    @UseMiddleware(Authorised)
    @Query(() => [VenueTagsResponse])
    async getMyTags(
        @Arg("venueID") venueID: string,
        @Ctx() { jwtPayload }: any
    ) {
        const { userID } = jwtPayload;

        const venue = await Venue.findById(venueID, 'tags').populate('tags.tag');
        if (!venue || !venue.tags) return [];

        let venueTags = [];
        for (let tag of venue.tags) {
            if (tag.taggers.includes(userID))
                venueTags.push(tag);
        }
        return venueTags;
    }

    /**
     * @description
     * Add a venue rating to a given venue
     * 
     * @param venueID: the venue's ID
     * @param rating: numeric rating out of 5
     * @param jwtPayload: the user's JWT token
     * @returns the updated venue with the new rating
     */
    @UseMiddleware(Authorised)
    @Mutation(() => Boolean)
    async addReview (
        @Arg("venueID") venueID: string,
        @Arg("rating") rating: number,
        @Ctx() { jwtPayload }: any
    ) {
        const { userID } = jwtPayload;

        let venue = await Venue.findById(venueID);
        if (venue) {
            // if the user has already reviewd this venue just update the review
            // and average rating
            
            // this will never happen
            if (!venue.ratings) throw new Error;

            let oldRating = 0;
            for (let review of venue.ratings) {
                if (review.reviewer === userID) {
                    oldRating = review.review;
                    review.review = rating;
                    break;
                }
            }

            // if this reviewer hasn't added a review here yet add it and
            // update the average rating
            if (oldRating === 0) {
                const ratingsCount = venue.ratings.length;
                const oldFlat = venue.averageRating * ratingsCount;

                await venue.update({
                    $push : {
                        "ratings" : {
                            review : rating,
                            reviewer : userID
                        }
                    }
                });

                venue.averageRating = (oldFlat + rating) / (ratingsCount + 1);
            } else {
                // otherwise update the old average rating
                const ratingsCount = venue.ratings.length;
                const oldFlat = venue.averageRating * ratingsCount;
                const newAverage = ((oldFlat - oldRating) + rating) / ratingsCount;

                console.log(oldFlat, oldRating);
                console.log(newAverage);

                // update the venue
                venue.averageRating = newAverage;
            }

            (await (await venue.populate('tags.tag')).save()).toObject;
            return true;
        } else {
            // assume that otherwise the Venue exists
            return false;
        }
    }

    /**
     * @description
     * Set the opening hours of a venue after creation. This should only
     * be usable by admins and the owner of a venue.
     * 
     * @param venueID: the venue's ID
     * @param hours: the new opening hours of the venue
     * @param jwtPayload: the user's JWT token
     * @returns the updated venue with the new opening hours
     */
    @Mutation(() => VenueResponse)
    async setOpeningHours (
        @Arg("venueID") venueID: string,
        @Arg("hours", () => [HoursInput]) hours: HoursInput[],
        @Ctx() jwtPayload: any
    ) {
        const { userID } = jwtPayload;

        let venue = await Venue.findByIdAndUpdate(venueID, 
            {
                "openingHours.hours" : []
            }
        );
        if (!venue) return venue;

        for (let hour of hours) {
            const newHour = {
                'day' : hour.day,
                'open' : {
                    'hours' : hour.open[0],
                    'minutes' : hour.open[1]
                },
                'close' : {
                    'hours' : hour.close[0],
                    'minutes' : hour.close[1]
                }
            };

            venue = await Venue.findByIdAndUpdate(venueID,
                {
                    $push : {
                        "openingHours.hours" : newHour
                    }
                }
            );
        }

        if (!venue) return venue;
        return (await venue.populate('tags.tag')).toObject();
    }
    
    /**
     * @description
     * Query all venue objects in the database
     * 
     * @returns all venue objects in the database
     */
    @Query(() => [VenueResponse])
    async getAllVenues () {
        const allVenues = await Venue.find({}).populate(["tags.tag", "menu.itemKind"]);
        return allVenues.map(x => x.toObject());
    }

    /**
     * @description
     * Query venues based on given search
     * criteria and return matching venues
     * 
     * @param searchCriteria: search input fields 
     * @returns an array of venues which match the criteria
     */
    @Query(() => VenueSearchResponse)
    async searchVenues (
        @Arg("searchCriteria") searchCriteria: SearchInput,
    ) {
        const searchResponses = await searchCriteria.asQuery.exec();
        await Venue.populate(searchResponses, { path: 'tags.tag' } );
        
        if (searchResponses.length == 0)
            return { errors: [noVenuesError] };
        else
            return { content: searchResponses.map(x => x.toObject()) };
    }

    /**
     * @description
     * Query all information associated with
     * the given venue
     * 
     * @param venueID: the venue's ID
     * @returns a populated venue response object for
     *          the venue matching the inputted venue ID
     */
    @Query(() => VenueInfoResponse)
    async getVenueInfoByID (
        @Arg("venueID") venueID: string
    ) {
        let venue = await Venue.findById(venueID).populate(["tags.tag", "menu.itemKind"]);
        
        if  (!venue) {
            return { errors: [noVenueMatch] }
        } else if (!venue.menu) {
            return { errors: [noMenuItems], venueInformation: venue.toObject()  }
        } else {
            return { venueInformation: venue.toObject() }
        }
    }

    /**
     * @description
     * Queries all venue tags in the system
     * 
     * @returns an array of venue tag information
     */
    @Query(() => [TagResponse])
    async getAllTags () {
        return (await VenueTags.find());
    }

    /**
     * @description
     * pull featured venues which
     * are those currently running
     * a promotion
     * 
     * @returns an array of venue response objects
     */
    @Query(() => [VenueResponse])
    async getFeaturedVenues () {

        // get all the venues where the promotion
        // end date is greater than now
        const now = new Date();
        const venues = await Venue.find({
            "promotion.endDate" : {
                $gt : now
            }
        }).populate(["tags.tag", "menu.itemKind"]);

        return venues.map(x => x.toObject());
    }
}