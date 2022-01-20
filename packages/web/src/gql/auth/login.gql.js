import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($credentials: LoginInput!) {
        login(credentials: $credentials) {
            token
            userType
            errors {
                message
            }
        }
    }
`;