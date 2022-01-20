import React from 'react'
import { 
    Grid, 
    Form, 
    Segment,
    Dimmer,
    Loader
} from 'semantic-ui-react'
import { NavBar } from '../components/NavBar/NavBar';
import { EmailInput } from '../components/AuthInput/AuthInput';
import { ForgotPassword } from '../gql/auth/reset.gql';
import { useLazyQuery } from '@apollo/client';
import { useHistory } from 'react-router';

import 'semantic-ui-less/semantic.less';

const Forgot = () => {

    const [email, setEmail] = React.useState('');
    const history = useHistory();
    

    const [ forgotPassword, { loading, error }] = useLazyQuery(ForgotPassword, {
        variables: { 
            email 
        },
        onCompleted: (data) => {
            if (data.forgotPassword) {
                history.push('/reset');
                return;
            }

            console.log("error");
        }
    }); 

    if (loading) {
        return (
            <Dimmer active>
                <Loader size='massive' />
            </Dimmer>
        )
    }

    if (error) {
        alert("service unavailable");
        history.push('/login');
    }
    

    return (
        <>
            <NavBar />
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450}} className="colClass circular">
            <Form size='large'>
                <Segment stacked>
                    Enter Email
                    <EmailInput email={email} setEmail={setEmail} />
                    <button 
                        type="submit"
                        className="buttonLogin" 
                        onClick={forgotPassword}
                    >
                    Next
                    </button>
                </Segment>
                </Form>
            </Grid.Column>
            </ Grid>
        </>
    );
}

export default Forgot;