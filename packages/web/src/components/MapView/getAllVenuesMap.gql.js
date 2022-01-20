import { gql } from '@apollo/client';

const GET_ALL_VENUES_MAP = gql`
    query getMapDisplayData($now: DateTime!) {
            getAllVenues {
                _id
                name
                venueType
                contactNumber
                location {
                    coordinates
                }
                isPromotion(now: $now)
                averageRating
                averagePrice
        }
    }
`;

export default GET_ALL_VENUES_MAP;