import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DeleteButton from '../DeleteButton/DeleteButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import EmailIcon from '@mui/icons-material/Email';
import { Icon } from 'semantic-ui-react';

/**
 * Display a basic account management dashboard
 * with the users email and joined date as well
 * as options to delete the account 
 * 
 * @param email - the users email
 * @param joinedDate - the date the user joined the site
 * 
 */
const AccountDash = ({
    email,
    joinedDate
}) => {
    return (
       <Container
            sx={{
                mt: 5,
            }}
       >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Card
                    raised
                    sx={{
                        // width: 355,
                        mb: 5,
                        // ml: 10,
                    }}
                >   
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            About you
                        </Typography>
                        <Stack direction="row" spacing={20}>
                            
                            <Typography variant="h6">
                                <Icon name="mail"/> Email
                            </Typography>
                            <Typography variant="h6">
                                    {email}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={19}>
                            <Typography variant="h6">
                                <Icon name="calendar alternate" /> Joined
                            </Typography>
                            <Typography variant="h6">
                                {new Date(Number(joinedDate)).toLocaleDateString()}
                            </Typography>
                        </Stack>
   
                    </CardContent>
                </Card>

                <DeleteButton />
            </Box>
       </Container>
    )
};



export default AccountDash;