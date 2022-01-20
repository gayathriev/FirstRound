import { gql } from '@apollo/client';

export const GetSelf = gql`
    query Self {
        getSelf { 
            userID
            username
            userType
        }
    }
`;