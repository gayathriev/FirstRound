import { gql } from '@apollo/client';


export const GET_PROFILE = gql`
    query GetProfile {
        getProfile {
            credits
            username
            email
            joinedDate
            myRoutes {
                _id
                name
            }
            sharedRoutes {
                _id
                name
            }
            activePromotions {
                _id
                venue {
                    name
                }
                percentageOff
                startDate
                endDate
            }
            futurePromotions {
                venue {
                    name
                }
                percentageOff
                startDate
                endDate
            }
            expiredPromotions {
                venue {
                    name
                }
                percentageOff
                startDate
                endDate
            }
        }
    }
`;