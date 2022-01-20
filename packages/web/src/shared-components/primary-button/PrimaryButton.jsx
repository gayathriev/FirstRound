import * as React from "react"
import PropTypes from 'prop-types';

/**
 * Primary Button component will be the rounded (oval)
 * style of the buttons.
 */
function PrimaryButton({
    content, 
    onClick,
    testReference
}) {
    return (
        <button 
            className="ui circular button primary" 
            onClick={onClick}
            data-cy={testReference}
        >
            {content}
        </button>
    );
}


PrimaryButton.propTypes = {
    content: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    testReference: PropTypes.string
};

export default PrimaryButton;

