import { gql } from '@apollo/client';


export const SHARE_ROUTE = gql`
    mutation ShareRoute(
        $recipient: String!,
        $route: String!,
        $routeID: String!, 
    ) {
        shareRoute(
            recipient: $recipient,
            route: $route,
            routeID: $routeID
        )
    }
`;
