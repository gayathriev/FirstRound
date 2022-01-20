import { gql } from '@apollo/client';

export const ProcessMenuItem = gql`
mutation ProcessMenuItem($decision: RequestStates!, $menuItemID: ID!, $venueID: ID!) {
    processMenuItem(decision: $decision, menuItemID: $menuItemID, venueID: $venueID)
  }
`;