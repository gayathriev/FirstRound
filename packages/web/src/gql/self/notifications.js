import { gql } from '@apollo/client';

export const SubNotificationsFeed = gql`
    subscription NotificationsFeed {
        feed {
            recipient
            message
            date
            action
            senderID
        }
    }
`;


export const GET_USR_NOTIFICATIONS = gql`
    query GetNotifications {
        getNotifications {
            recipient
            message
            date
            action
        }
    }    
`;