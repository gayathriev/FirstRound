import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types'

const FilterDropdown = ({sortDistance, sortPrice, sortReviews}) => {

	return (
		<Dropdown
		icon='filter'
		floating
		button
		className='icon'
		color='yellow'
		>
			<Dropdown.Menu>
				<Dropdown.Header icon='tags' content='Sort Results' />
				<Dropdown.Item 
					icon='dollar' 
					text='Price ($ - $$)' 
					onClick={(event, { text }) => {
						sortPrice();
					}}/>
				<Dropdown.Item 
					icon='map marker' 
					text='Distance from me' 
					onClick={(event, { text }) => {
						sortDistance();
					}}
				/>
				<Dropdown.Item 
					icon='star' 
					text='By Reviews' 
					onClick={(event, { text }) => {
						sortReviews();
					}}
				/>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default FilterDropdown;

FilterDropdown.propTypes = {
	sortDistance: PropTypes.func,
    sortReviews: PropTypes.func,
    sortPrice: PropTypes.func,
}
