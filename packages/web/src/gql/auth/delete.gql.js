import { gql } from '@apollo/client';


export const DeleteUser = gql`
    mutation DeleteUser {
        deleteUser
    }
`;