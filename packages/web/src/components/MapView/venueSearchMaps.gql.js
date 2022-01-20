import { gql } from '@apollo/client';

const SEARCH_VENUES_MAP = gql`
    query search($searchCriteria: SearchInput!, $now: DateTime!) {
        searchVenues(searchCriteria: $searchCriteria) {
            content {
                _id
                name
                venueType
                address
                contactNumber
                location {
                    coordinates
                }
                openingHours {
                    _id
                    hours {
                      _id
                      day
                      open {
                        _id
                        hours
                        minutes
                      }
                      close {
                        _id
                        hours
                        minutes
                      }
                    }
                }
                tags {
                    tag {
                        _id
                        text
                    }
                    count
                }
                isPromotion(now: $now)
                averageRating
                averagePrice
            }
            errors
        }
    }
`
export default SEARCH_VENUES_MAP;