import { gql } from '@apollo/client';

export const AddTag = gql`
    mutation AddTag($venueID: String!, $tagID: String!) {
        addVenueTag(venueID: $venueID, tagID: $tagID) {
            name
        }
    }
`;