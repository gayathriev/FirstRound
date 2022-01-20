import * as React from "react"
import PropTypes from 'prop-types';
import { Form, Dropdown } from "semantic-ui-react";



function SearchBar({
    search, setSearch,
}) {
    return (
        <Form.Input 
            fluid 
            icon='search' 
            action='Search'
            iconPosition='left' 
            placeholder='Find business' 
            required="required"
            onChange={e => setSearch(e.target.value)}
            value={search}
        />
    );
}

export default SearchBar;

SearchBar.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func,
  };