import { gql } from '@apollo/client';

export const RemoveTag = gql`
    mutation RemoveTag($venueID: String!, $tagID: String!) {
        removeVenueTag(venueID: $venueID, tagID: $tagID) {
            name
        }
    }
`;