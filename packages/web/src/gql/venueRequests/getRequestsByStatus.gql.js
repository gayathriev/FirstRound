import { gql } from '@apollo/client';

export const GET_REQUESTS_BY_STATUS = gql`
    query requestsByStatus($status: RequestStates!) {
        getRequestsByStatus(status: $status) {
            _id
            venue {
              name
            }
            claimant {
              username
            }
            verificationDocuments
        }
    }
`;