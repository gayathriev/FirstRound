import React from 'react';
import { Feed } from 'semantic-ui-react';
import { formatDistance } from 'date-fns'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


/**
 *
 * Renders a Notification 
 * this populates the users
 * notifications feed
 * 
 * @param action - on click action to 
 * carry out
 * 
 * @param message - displays message
 * 
 * @param date - date sent
 */

const Notification = ({ action, message, date }) => {

    const handelNotificationAction = () => {
        window.location = action;
    }

    return (
        <Feed.Event
            className="feed-item"
            // icon="location arrow"
        >
            <Feed.Summary>
                <Feed.Date>
                    {date && 
                        formatDistance(new Date(date), new Date(), { addSuffix: true }) 
                    }
                </Feed.Date>
                <Box
                    onClick={handelNotificationAction}
                >
                    <Stack direction="row" spacing={1}>
                        <Avatar />
                        <Typography>
                            { message }
                        </Typography>
                    </Stack>
                </Box>
            </Feed.Summary>
        </Feed.Event> 
    )
};



export default Notification;