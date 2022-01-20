import * as React from "react";
import { Button } from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import { useHistory  } from 'react-router-dom';

/**
 *
 * @returns Business Badge sits in
 * navbar to re-direct to login page 
 * with USERTYPE business
 * for authentication.
 * 
 */

const BusinessBadge = () => {
    const history = useHistory();

    const goToBusinessSignIn = () => {   
        history.push("/register-business");
    }
  
    return (
        <Button 
            className='ui button primary'
            content={"I'm a business!"}
            circular
            onClick={goToBusinessSignIn}
        />
    );
};

export default BusinessBadge;