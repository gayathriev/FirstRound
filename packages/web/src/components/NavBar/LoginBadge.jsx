import * as React from "react"
import CircularBadge from "../../shared-components/CircularBadge";
import { useHistory  } from 'react-router-dom';


/**
 * @returns LoginBadge sits in
 * navbar to redirect user to 
 * Login/page to get 
 * athenticated
 * 
 */


const LoginBadge = () => {
    const history = useHistory();

    const goToLoginPage = () => {
       history.push('/login');
    }
  
    return (
        <CircularBadge 
            iconName={'sign in alternate'}
            onClick={goToLoginPage}
            testReference={'login-button'}
        />
    );
};

export default LoginBadge;