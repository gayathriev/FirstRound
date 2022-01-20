import { gql } from '@apollo/client';

export const MenuItemUpload = gql`
    mutation MenuItemUpload(
        $menuItemData: AddMenuItemInput!, 
        $venueID: String!, 
        $file: Upload!
    ) {
        menuItemUpload(
            menuItemData: $menuItemData, 
            venueID: $venueID, 
            file: $file
        )
    }
`;

