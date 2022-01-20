import { gql } from '@apollo/client';

/** @todo - patch this to drop senderID */
export const ShareVenue = gql`
    mutation venueNotification(
        $recipient: String!, 
        $venue: String!, 
        $venueID: String!
    ) {
        shareVenue(
            recipient: $recipient,
            venue: $venue, 
            venueID: $venueID
        )
    }
`;
