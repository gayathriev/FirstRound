import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory  } from 'react-router-dom';
import { 
    Form, 
    Grid, 
    Message, 
    Segment,
    Dimmer,
    Loader 
} from 'semantic-ui-react';
import { 
    RegisterBusiness, 
    RegisterCustomer 
} from '../../gql/auth/register.gql';
import { UserTypes } from '../../constants/userTypes';
import { 
    UsernameInput, 
    PasswordInput, 
    EmailInput 
} from '../AuthInput/AuthInput';
import PrimaryButton from "../../shared-components/primary-button/PrimaryButton";
import propTypes from 'prop-types';
import '../../styles/auth.css';

/**
 * Displays Registeration Form according to userType
 * 
 * @param userType  - Takes in userType to handle different logic
 * 			  		- for registration.
 * 
 */

export const RegistrationForm = ({ userType }) => {
	const RegisterQuery = (userType === UserTypes.CUSTOMER) 
							? RegisterCustomer 
							: RegisterBusiness;
	const queryName = (userType === UserTypes.CUSTOMER)
						? 'registerCustomer'
						: 'registerBusiness';

    const redirectRef = (userType === UserTypes.CUSTOMER)
                        ? '/'
                        : '/business';


	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [ register, {loading, error, data} ] = useMutation(RegisterQuery);
    const history = useHistory();
    let hideError = true;


	const handleRegister = async () => {
		if (!username || !email || !password)
			return;

		try {
			const res = await register({
				variables: {
					data: {
						username,
						email,
						password
					}
				}
			})

			if (res.data[queryName].token) {
                localStorage.setItem(
                    'sesh', res.data[queryName].token
                );
                // force ws to connect
				window.location = redirectRef;
				return;
			}

		} catch (error) {
            hideError = false;
		}
	};

    if (loading) 
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )


    if (data && data[queryName].errors) 
        hideError = false;


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
						<EmailInput
							email={email}
							setEmail={setEmail}
						/>
						<PasswordInput 
							password={password}
							setPassword={setPassword}
						/>
						<PrimaryButton 
							content={'Register'}
							onClick={handleRegister}
						/>
					</Segment>
				</Form>
                <Message 
                    hidden={hideError}
                    error
                    header='Register Failed'
                    content='Email or username taken'
                />
				<Message>
					Already have an account? 
					<a href="/login" className="signupLink">
						Login
					</a>
				</Message>
			</Grid.Column>
		</ Grid>
	);
};


RegistrationForm.propTypes = {
	userType: propTypes.string.isRequired
};


export default RegistrationForm;