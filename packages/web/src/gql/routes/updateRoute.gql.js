import { gql } from '@apollo/client';

export const UPDATE_ROUTE = gql`
    query EditRoute($venueIDs: [String!]!) {
    editRoute(venueIDs: $venueIDs) {
            errors
            content {
                venuesInRoute {
                    _id
                    name
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