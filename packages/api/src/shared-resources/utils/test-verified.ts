import { UserType } from "../../resolvers/users/users.constants";
import { Business } from "../../entities/Users";

/**
 * @description
 * Test whether the authenticated user
 * owns the inputted venue
 * 
 * @param jwtPayload: the user's JWT token
 * @param venueID: the venue's ID 
 * @returns boolean indicating whether they own the venue
 */
export async function testVerified (
    jwtPayload: any,
    venueID: string
) {
    let isVerified: boolean = false
    // check if we're the business owner
    if (jwtPayload.userType == UserType.BUSINESS) {
        // get the user object
        const businessUser = await Business.findById(jwtPayload.userID)
        // get the user's venues
        if (businessUser && businessUser.verifiedVenues) {

            // check if there is a Business user where the id is our user's id and they have a venue
            // with 'venueID' in their verifiedVenues
            isVerified = await Business.exists({_id: jwtPayload.userID, verifiedVenues: {$in: [venueID] } })

        } 
    }
    
    return isVerified
}