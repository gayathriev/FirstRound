import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MenuItemCard  from './MenuItemCard';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Icon } from 'semantic-ui-react';

/**
 * Displays a carousel of menus
 * per venue with unverified 
 * items queue
 * 
 * @param venuesList - the list of verified venues
 * the business owns
 * 
 * @param refetchVenues - the refetching function 
 * for the query that pulls a businesses verified
 * venues
 */
const ReviewVenueCarousel = ({ venuesList, refetchVenues, getVenues }) => {
    
    // filter by unverified menu items
    const [verificationQueue, updateVerificationQueue] = useState(() =>
        venuesList.filter(venue => venue.menu.find(item => !item.verified))
    );

    const [queueDone, setQueueDone] = useState(false);


    // JavaScript's `%` operator is for 
    // remainder, not modulo
    const mod = (n, m) => ((n % m) + m) % m;
    const [currentVenue, setCurrentVenue] = useState(0);
    
    // increment venue queue
    const nextVenue = () => setCurrentVenue(
        mod(currentVenue + 1, verificationQueue.length)
    );

    // decrement venue queue
    const prevVenue = () => setCurrentVenue(
        mod(currentVenue - 1, verificationQueue.length)
    );

    // update the venue list to remove
    // the item from the queue
    const updateQueue = (itemID) => {
        
        // remove the item from the 
        // venue's menu
        let newVenueJobs = verificationQueue[currentVenue].menu.filter(
            item => item._id !== itemID
        );
        
        updateVerificationQueue(
            verificationQueue.map(
                venue => venue._id === verificationQueue[currentVenue]._id
                    ? {
                        ...venue,
                        menu: newVenueJobs
                    }
                    : venue
            )
        );

        refetchVenues();
        getVenues();
        
        if (newVenueJobs.length < 1 || verificationQueue.length < 1) {
            setQueueDone(true);
        }
    }

    // list for the current venue
    return (
        <Box sx={{ maxWidth: 600 }} >
            <Card 
                variant="outlined"
            >
                <Box>
                    { (verificationQueue.length > 0 && !queueDone) ? (
                        <Box sx={{ m: 5}} >
                            <Typography variant="h5" >
                                { verificationQueue[currentVenue].name }
                            </Typography>

                            <Scrollbars
                                autoHide
                                style={{ height: 400, float: 'left' }}
                            >
                                {
                                    verificationQueue[currentVenue].menu.map((menuItem, index) => {
                                        if (!menuItem.verified)
                                            return (
                                                <MenuItemCard 
                                                    key={index}
                                                    menuItem={menuItem}
                                                    propVenueID={verificationQueue[currentVenue]._id}
                                                    updateQueue={updateQueue}
                                                    refetchVenues={refetchVenues}
                                                />
                                            ) 
                                    })
                                }
                            </Scrollbars>        

                            <Box sx={{ml: 2, mr: 2, mt: 4}} >

                                <Button
                                    style={{ 
                                        marginBottom: 10,
                                        marginTop: 10 
                                    }}
                                    size='large'
                                    circular
                                    floated='right'
                                    icon={<Icon name='chevron right' />}
                                    onClick={() => nextVenue()}
                                />

                                <Button
                                    style={{ 
                                        marginBottom: 10,
                                        marginTop: 10
                                    }}
                                    size='large'
                                    circular
                                    floated='left'
                                    icon={<Icon name='chevron left' />}
                                    onClick={() => prevVenue()}
                                />
                            </Box>
                        </Box>

                        ) : (
                            <Box sx={{ mb: 5, ml: 1}} >
                                <Typography variant="h5">
                                    No verification jobs
                                </Typography>

                                <Typography variant="body1">
                                    User added menu items will appear here.
                                </Typography>
                            </Box>
                        )
                    }
                </Box>
            </Card>
        </Box>
    );
};


export default ReviewVenueCarousel;



/**


                      <Button
                                size='massive'
                                circular
                                floated='right'
                                icon={<Icon name='chevron left' />}
                                onClick={() => prevVenue()}
                            />


                            <Button
                                size='massive'
                                circular
                                floated='left'
                                icon={<Icon name='chevron right' />}
                                onClick={() => nextVenue()}
                            />

 */