import { gql } from '@apollo/client';

export const GetAllItemKinds = gql`
    query GetAllItemKinds {
        getAllItemKinds {
            food {
                _id
                type
            }
            drink {
                _id
                type
            }
        }
    }
`;