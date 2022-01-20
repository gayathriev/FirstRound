import React from "react";
import { Segment } from 'semantic-ui-react';
import DropdownTagBar from './DropdownTagBar';
import PropTypes from 'prop-types'


const SearchTagBar = ({searchTags, setSearchTag}) => {
    return ( 
		<Segment 
			color='blue'
			className='rounded'
		>
            <h5>Add search tags</h5>
            <DropdownTagBar 
                searchTag={searchTags}
                setSearchTag={setSearchTag}
            />
		</Segment>
    );
};
export default SearchTagBar;

SearchTagBar.propTypes = {
    searchTags: PropTypes.array,
    setSearchTag: PropTypes.func,
}