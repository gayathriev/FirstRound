import React from "react";
import { 
	Icon,
	Label
} from 'semantic-ui-react';
import PropTypes from 'prop-types'


/**
 * 
 * @returns a card that renders the item search in 
 * labels so the user can see which item they added
 * to the search criteria
 * 
 * Also handles removing item from search criteria
 * 
 * @param itemSearch - state used to items to search
 * 
 * @param setItemSearch - state function used to set items to search
 * 
 */

const MenuItemCard = ({itemSearch, setItemSearch}) => {

	const removeItem = index => {
		setItemSearch([...itemSearch.filter(card => itemSearch.indexOf(card) !== index)]);
	};

    return ( 
		<div>
			{
				itemSearch.map((tag, index) => (
					<Label 
						key={index}
						as='a' 
						icon
						circular
						color='blue'
						style={{marginTop: '3%'}}
					>
						{tag.price ? `$${tag.price}` : ''} {tag.itemName} {tag.itemKind.text}
						<Icon name='close' onClick={() => removeItem(index)}  />
					</Label>
				))
			}
		</div>

    );
};
export default MenuItemCard;

MenuItemCard.propTypes = {
    itemSearch: PropTypes.array.isRequired,
    setItemSearch: PropTypes.func.isRequired
}