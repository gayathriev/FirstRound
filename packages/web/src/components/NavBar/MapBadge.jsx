import React from 'react';
import { Icon } from "semantic-ui-react";
import { useHistory  } from 'react-router-dom';

/**
 *
 * @returns Map Badge sits in
 * navbar to render /home again
 * Used after when user sees routes
 * 
 */


const MapBadge = () => {
    const history = useHistory();
    const gotToMap = () => {
       window.location = '/'; 
    };

    return (
        <button
            className="ui icon button primary" 
            style={{ borderRadius: 100}} 
            onClick={gotToMap}
        >
            <Icon name="map"/>
        </button>
    )
};



export default MapBadge;