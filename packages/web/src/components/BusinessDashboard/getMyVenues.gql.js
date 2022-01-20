import { gql } from '@apollo/client';

export const GET_MY_VENUES = gql`
    query getMyVenues {
        getVenuesForSelf {
            _id
            name
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

            menu {
                _id
                name
                price
                itemKind {
                    category
                    type
                }
                verified
                uploader
                promotion
                special
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
    }
}`;