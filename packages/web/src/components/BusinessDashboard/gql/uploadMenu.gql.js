import { gql } from '@apollo/client';

export const UploadMenu = gql`
    mutation UploadMenuMutation($venueID: String!, $menuItemData: AddWholeMenuInput!) {
        uploadMenu(venueID: $venueID, menuItemData: $menuItemData) {
            errors
            success
        }
    }
`;