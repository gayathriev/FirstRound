import * as React from "react"
import { Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types';

/**
 * Circular Button component will be the rounded
 * style of the buttons.
 */
const CircularBadge = ({ iconName, onClick }) => {
    return (
        <button 
            className="ui icon button primary" 
            style={{ borderRadius: 100}} 
            onClick={onClick}
        >
            <Icon name={iconName}/>
        </button>
    );
}


CircularBadge.propTypes = {
    iconName: PropTypes.string.isRequired,
    handleFunction: PropTypes.func,
};



export default CircularBadge;