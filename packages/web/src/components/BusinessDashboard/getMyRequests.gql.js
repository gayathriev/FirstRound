import { gql } from '@apollo/client';

export const GET_MY_PENDING_REQUESTS = gql`
    query getMyPendingRequests {
        getMyRequestsByStatus (status: "PENDING") {
            _id
            venue {
                _id
                name
            }
        }
    }
`;

export const GET_MY_REJECTED_REQUESTS = gql`
    query getMyRejectedRequests {
        getMyRequestsByStatus (status: "REJECTED") {
            _id
            venue {
                _id
                name
            }
            reasonForRejection
            verificationDocuments
        }
    }
`;