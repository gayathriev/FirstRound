import { gql } from '@apollo/client';

export const UPDATE_REQUEST_STATUS = gql`
    mutation updateRequestStatus($decision: RequestStates!, $requestID: ID!, $comment: String) {
        processRequest(decision: $decision, requestID: $requestID, comment: $comment) 
    }
`