import * as React from "react"
import { Form } from "semantic-ui-react";
import PropTypes from 'prop-types';


export const UsernameInput = ({
  username, setUsername
}) => {
    return (
        <Form.Input 
            fluid 
            icon='user' 
            iconPosition='left' 
            placeholder='Username' 
            required='required'
            onChange={e => setUsername(e.target.value)}
            value={username}
            data-cy='username-input'
        />
    );
};


export const EmailInput = ({
  email, setEmail
}) => {
    return (
        <Form.Input 
            fluid 
            icon='envelope' 
            iconPosition='left' 
            placeholder='Email' 
            required='required'
            onChange={e => setEmail(e.target.value)}
            value={email}
            data-cy='email-input'
        />
    );
};


export const PasswordInput = ({
  password, setPassword
}) => {
    return (
        <Form.Input 
            fluid 
            icon='lock' 
            iconPosition='left' 
            placeholder='Password' 
            required="required"
            type='password'
            onChange={e => setPassword(e.target.value)}
            value={password}
            data-cy='password-input'
        />
    );
};


EmailInput.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
};


UsernameInput.propTypes = {
  username: PropTypes.string,
  setUsername: PropTypes.func,
};


PasswordInput.propTypes = {
  password: PropTypes.string,
  setPassword: PropTypes.func,
};