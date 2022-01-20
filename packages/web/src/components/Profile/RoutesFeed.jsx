import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import RouteSummary from './RouteSummary';


/**
 * 
 * @returns a list of routes
 * in two sets of accordion panels
 * one for the user's routes
 * and one for routes shared 
 * with the user. Similar in
 * fashion to the promotions
 * feed
 * 
 * @param myRoutes - user generated routes
 * 
 * @param sharedWithMe - routes shared to the user
 */
const RoutesFeed = ({ myRoutes, sharedWithMe }) => {
    return (
        <Container
            sx={{
                display: 'flex',
                mt: 8,
                // minWidth: '320px'
            }}
        >
            <Stack 
                spacing={2} 
                m='auto'
                width='100%'
                minWidth={250}
                maxWidth={500}
            >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            My Routes
                        </Typography>
                    </AccordionSummary>
                        <AccordionDetails>
                            {myRoutes.map((route, index) => (
                                <RouteSummary
                                    key={index}
                                    index={index + 1}
                                    id={route._id}
                                    name={route.name}
                                />
                            ))}
                        </AccordionDetails>
                </Accordion>   


                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                           Shared With Me
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                            {sharedWithMe.map((route, index) => (
                                <RouteSummary
                                    key={index}
                                    index={index + 1}
                                    id={route._id}
                                    name={route.name}
                                />
                            ))}
                    </AccordionDetails>
                </Accordion> 
            </Stack>
       </Container>
    )
};



export default RoutesFeed;