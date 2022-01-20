import { gql } from "@apollo/client";

export const REDEEM_PROMOTION = gql`
    mutation RedeemPromotionMutation($venueID: String!) {
        redeemPromotion(venueID: $venueID) {
            errors
            success
        }
    }
`;