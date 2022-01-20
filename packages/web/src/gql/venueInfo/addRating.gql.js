import { gql } from '@apollo/client';


export const AddRating = gql`
    mutation AddReviewMutation($rating: Float!, $venueID: String!) {
        addReview(rating: $rating, venueID: $venueID)
    }
`;