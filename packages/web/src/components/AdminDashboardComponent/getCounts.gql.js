import { gql } from '@apollo/client';

export const GET_USERS_COUNT = gql`
    query getUsersCount {
        getUsersCount {
            count
        }
    }
`;

export const GET_BUSINESS_COUNT = gql`
    query getBusinessCount {
        getBusinessCount {
            count
        }
    }
`;
