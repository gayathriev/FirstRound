import { gql } from '@apollo/client';

// save route mutation
export const SAVE_ROUTE = gql`
    mutation GenerateRoute($route: SaveRouteInput!) {
        saveRoute(route: $route) {
            content {
                _id
                name
            }
            errors
        }
    }
`;
