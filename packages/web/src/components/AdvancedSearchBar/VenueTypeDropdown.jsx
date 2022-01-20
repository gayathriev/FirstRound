import React from "react";
import { 
	Dropdown,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

/**
 * 
 * @returns a drop down bar to set the venueType
 * this component is used in advanced search.
 * 
 * @param venueType - state used to set current venueType
 * 
 * @param setVenueType - state function used to set setVenueType
 * 
 */

const venueTypeOptions = [
	{
		key: "BAR",
		text: "Bars/Pubs",
		value: "BAR"
	},
	{
		key: "RESTAURANT",
		text: "Restaurants",
		value: "RESTAURANT"
	},
	{
		key: "CAFE",
		text: "Cafés",
		value: "CAFE"
	},
	{
		key: "ALL",
		text: "All",
		value: "All"
	}    
]

const VenueTypeDropdown = ({venueType, setVenueType}) => {
    return ( 
		<Dropdown
			placeholder='Select venue type'
			selection
			fluid
			onChange={(event, { value }) => {
				if (value === 'All') {
					setVenueType(value);
				}
				else {
					setVenueType(value);
				}
			}}
			value={venueType}
			options={venueTypeOptions}
		/> 

    );
};
export default VenueTypeDropdown;

VenueTypeDropdown.propTypes = {
    venueType: PropTypes.string.isRequired,
    setVenueType: PropTypes.func.isRequired
}
