import * as React from "react"
import PropTypes from 'prop-types';
import { Form, Dropdown } from "semantic-ui-react";


/** @todo - get from backend! */
const options = [
    { key: 'burgers', text: 'burgers', value: 'burgers' },
    { key: 'chicken', text: 'chicken', value: 'chicken' },
    { key: 'pizza', text: 'pizza', value: 'pizza' },
    { key: 'alcohol', text: 'alcohol', value: 'alcohol' },
  ]

  function DropdownSearchBar({
    search, setSearch,
    }) {
        return (
            <Dropdown 
                icon='search'
                placeholder='Add tags' 
                fluid multiple selection 
                search
                options={options} 
            />
        );
    }

export default DropdownSearchBar;

DropdownSearchBar.propTypes = {
    search: PropTypes.array,
    setSearch: PropTypes.func,
  };