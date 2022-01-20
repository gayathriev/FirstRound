import React from 'react'
import { 
    Grid, 
    Form, 
    Segment,
    Dimmer,
    Loader
} from 'semantic-ui-react'
import { NavBar } from '../components/NavBar/NavBar';
import { PasswordInput } from '../components/AuthInput/AuthInput';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { ResetAccount } from '../gql/auth/reset.gql';
import 'semantic-ui-less/semantic.less';


const Reset = () => {

    const [ newPassword, setNewPassword ] = React.useState('');
    const [ confirmPassword, setConfirmPassword ] = React.useState('');
    const [ token, setToken ] = React.useState('');
    const [ resetAccount, { loading, error } ] = useMutation(ResetAccount);

    const history = useHistory();
  
    const handleReset = async () => {
      const res = await resetAccount({
        variables: {
            token: token,
            password: confirmPassword
        }
      });

        if (res.data.resetAccount) {
            // redirect home for now
            history.push('/login');
            return;
        }

        alert("Bad Token, expired or invalid");
    }

    if (loading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    
    return (
        <>
            <NavBar />
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450}} className="colClass circular">
                    <h1 className="header">
                        Reset Account
                    </h1>
                    <Form size='large'>
                        
                            <div 
                                id="errorMessage" 
                                style={{display: 'none', color: 'red'}}>
                                    <b>Passwords do not match!</b>
                            </div>
                            <Segment stacked>
                                <Form.Input 
                                    fluid 
                                    icon='tag' 
                                    iconPosition='left' 
                                    placeholder='Enter Token' 
                                    required="required"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                                <PasswordInput
                                    password={newPassword}
                                    setPassword={setNewPassword}
                                />
                                <PasswordInput
                                    password={confirmPassword}
                                    setPassword={setConfirmPassword}
                                />
                                <button 
                                    className="buttonLogin" 
                                    onClick={handleReset}
                                >
                                    Reset Account
                                </button>
                            </Segment>
                        </Form>
                </Grid.Column>
            </ Grid>
        </>
    );
}

export default Reset;