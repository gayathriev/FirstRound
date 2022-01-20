import React, { useState } from 'react';
import { 
    Dimmer,
    Loader,
 } from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import { useMutation } from '@apollo/client';
import { UsernameInput, PasswordInput } from '../AuthInput/AuthInput';
import { Form, Grid, Message, Segment } from 'semantic-ui-react';
import { useHistory  } from 'react-router-dom';
import { LOGIN } from '../../gql/auth/login.gql';
import { UserTypes } from '../../constants/userTypes';
import PrimaryButton from "../../shared-components/primary-button/PrimaryButton";
import '../../styles/auth.css';

/** 
 * Renders a login form for all users
 * to authenticate with the platform.
 * */
const LoginForm = () => {
    let hideError = true;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [ login, {loading, error, data} ] = useMutation(LOGIN);

    const history = useHistory();

    const handleLogin = async () => {
        hideError = true;        
        if(!username || !password)
            return;

        // try {
        const res = await login({
            variables: {
                credentials: {
                    username,
                    password
                }
            }
        })
    };

    if (loading) 
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )

    if (error)
        hideError = false;


    // display error ?
    if (data && data.login.errors)
        hideError = false;

    // login success
    if (data && data.login.token) {

        // stash cookie for ws connection
        localStorage.setItem('sesh', data.login.token);

        // make websocket connect with
        // hard redirect
        switch(data.login.userType) {
            case UserTypes.ADMIN:
                history.push('/admin');
                break;
            case UserTypes.BUSINESS:
                window.location = '/business';
                break;
            default:
                window.location = '/';
        }
    }


    return (
        <Grid 
            textAlign='center' 
            style={{ height: '100vh' }} 
            verticalAlign='middle'
        >
            <Grid.Column style={{ maxWidth: 450 }}>
                <h1 className="header">
                    Welcome to First Round!
                </h1>
                <Form size='large' verticalAlign='middle'>
                    <Segment raised>
                        <UsernameInput
                            username={username}
                            setUsername={setUsername}
                        />
                        <PasswordInput 
                            password={password}
                            setPassword={setPassword}
                        />
                        <PrimaryButton
                            content={'Login'}
                            onClick={handleLogin}
                            testReference='login-button-form' 
                        />
                    </Segment>
                </Form>
                <Message 
                    hidden={hideError}
                    error
                    header='Login Failed'
                    content='Incorrect username or password'
                />
                <Message>
                    Don't have an account? 
                    <a 
                        href="/register" 
                        className="signupLink"
                        data-cy="register-link"
                    >
                        Register
                    </a>
                </Message>
                <Message>
                    <a href='/forgot' className='signupLink'>
                        Forgot Password?
                    </a>
                </Message>
            </Grid.Column>
        </ Grid>
    );
};

export default LoginForm;