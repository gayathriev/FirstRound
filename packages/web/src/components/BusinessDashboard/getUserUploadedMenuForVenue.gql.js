import { gql } from '@apollo/client';

export const GET_MY_PENDING_USER_UPLOADED_VENUE = gql`
    query GetUserUploadedMenuForVenue($venueId: ID!) {
        getUserUploadedMenuForVenue(venueID: $venueId) {
            name
            price
        }
    }
`;

