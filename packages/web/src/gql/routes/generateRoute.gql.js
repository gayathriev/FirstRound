import { gql } from '@apollo/client';

//  todo fix this
export const GenerateRoute = gql`
    mutation GenerateRoute($routeInput: RouteOptionsInput!) {
        generateRoute(routeInput: $routeInput) {
            errors
            content {
                venuesInRoute {
                    _id
                    name
                    venueType
                    address
                    contactNumber
                    location {
                        type
                        coordinates
                    }
                    tags {
                        count
                        tag {
                            text
                        }
                    }
                    openingHours {
                        hours {
                            day
                            open {
                                hours
                                minutes
                            }
                            close {
                                hours
                                minutes
                            }
                        }
                    }
                }
                routeGeometry
            }
        }
    }
`;