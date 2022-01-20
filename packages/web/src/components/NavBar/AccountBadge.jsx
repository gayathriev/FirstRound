import * as React from "react"
import { Icon } from "semantic-ui-react";
import { useHistory  } from 'react-router-dom';



/**
 *
 * @returns Account Badge sits in
 * navbar to redired to 
 * user account page.
 * Where they can see their 
 * routes and credits
 * 
 */


const AccountBadge = () => {

    const history = useHistory();

    const goToAccount = () => {
        history.push("/profile");
    }

    return (
        <button
            className="ui icon button primary" 
            style={{ borderRadius: 100}} 
            onClick={goToAccount}
            data-cy='account-badge'
        >
            <Icon name="user circle outline"/>
        </button>
    );
};

export default AccountBadge;