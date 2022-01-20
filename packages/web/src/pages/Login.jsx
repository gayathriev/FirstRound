import React from 'react'
import 'semantic-ui-less/semantic.less';
import propTypes from 'prop-types';
import { NavBar } from '../components/NavBar/NavBar';
import LoginForm from '../components/LoginForm/LoginForm'

const Login = ({userType}) => { 
  
  return (
    <>
      <NavBar/>
      <LoginForm userType={userType}/>    
    </>
  );
}


Login.propTypes = {
  userType: propTypes.string
}

export default Login;