import { gql } from '@apollo/client';

export const GetRouteByID = gql`
    query Query($routeID: String!) {
        getRouteByID(routeID: $routeID) {
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