import { gql } from '@apollo/client';

// TODO - write backend
export const SearchUser = gql`
    query SearchUser($usernameFragment: String!) {
        searchUsers(usernameFragment: $usernameFragment) {
            username
            _id
        }
    }
`;
