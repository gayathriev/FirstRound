import { gql } from '@apollo/client';

export const GetMyTags = gql`
    query getMyTags($venueID: String!) {
        getMyTags(venueID: $venueID) {
            tag {
                _id
            }
        }
    }
`;