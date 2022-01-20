import React from 'react';
import { Icon } from "semantic-ui-react";
import { useHistory  } from 'react-router-dom';


/**
 *
 * @returns Home Badge sits in
 * navbar for only Business
 * accounts. Redirects them
 * to Business dashboard.
 */

const BusinessHomeBadge = () => {
    const history = useHistory();
    const goToHome = () => {
        history.push("/business");
    }


    return (
        <button
            className="ui icon button primary" 
            style={{ borderRadius: 100}} 
            onClick={goToHome}
        >
            <Icon name="home"/>
        </button>
    )
};



export default BusinessHomeBadge;