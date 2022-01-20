import { gql } from '@apollo/client';

// return high-level venue information
export const SummaryVenueInfo = gql`
query Query($venueID: String!) {
    getVenueInfoByID(venueID: $venueID) {
      errors
      venueInformation {
        _id
        name
        venueType
        address
        contactNumber

        location {
            coordinates
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

        promotion {
            startDate
            endDate
            percentageOff
            creditsRequired
        }
        
        tags {
          tag {
            text
          }
          count
        }

      }
    }
  }
`

// return detailed venue information


export const DetailedVenueInfo = gql`
    query Query($venueID: String!) {
    getVenueInfoByID(venueID: $venueID) {
        venueInformation {
            _id
            name
            venueType
            averageRating
            averagePrice
            uploadValue

            openingHours {
                hours {
                    day
                    open {
                        minutes
                        hours
                    }
                    close {
                        hours
                        minutes
                    }
                }
            }

            menu {
                name
                price
                verified
                uploader
                special
                promotion
                itemKind {
                    category
                    type
                }
                specialExpiry {
                    specialStart
                    specialEnd
                }
                specialHours {
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

            promotion {
                startDate
                endDate
                percentageOff
                creditsRequired
            }
            
            tags {
                tag {
                    _id
                    text
                }
                count
            }

            location {
                _id
                type
                coordinates
            }

            address
            postcode
            contactNumber
        }
    }
}`;


export const GET_FEATURED_VENUES = gql`
    query GetVenueData {
        getFeaturedVenues {
            _id
            name
            address
            venueType
            contactNumber

            openingHours {
                hours {
                    day
                    open {
                        minutes
                        hours
                    }
                    close {
                        hours
                        minutes
                    }
                }
            }

            location {
                coordinates
            }

            tags {
                tag {
                    text
                }
            }
        }
    }
`;