import { gql } from '@apollo/client';

export const GET_ALL_VENUES = gql`
    query getVenueData {
        getAllVenues {
            _id
            name
        }
    }
`;