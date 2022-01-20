import { gql } from '@apollo/client';

export const AddPromotion = gql `
    mutation AddPromotionMutation($promotionInput: PromotionInput!, $venueID: String!) {
        addPromotion(promotionInput: $promotionInput, venueID: $venueID) {
        errors
        success
        }
    }
`;

