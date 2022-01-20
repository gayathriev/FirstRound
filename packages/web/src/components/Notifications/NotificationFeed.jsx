import React from 'react';
import { Feed } from 'semantic-ui-react';
import Notification from './Notification';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Divider from '@mui/material/Divider';
import './notifications.css'

/**
 * 
 * @param {*} feed 
 * @returns feed component
 * 
 * Takes in a notifications feed 
 * for the current user and displays
 * them in real time in a list.
 * 
 * @todo 
 * 
 * + Add a way to remove a notification
 * + Fix persistence of notifications
 * + Add unread to alert to navbar
 */
const NotificationFeed = ({ feed }) => {
    console.log(feed);
    return (
        <Scrollbars 
            autoHide
            autoHeight
            style={{ width: 200 }}
        > 
            <Feed className='notification-feed'>
                {
                    feed.map((notification, index) => (
                        <>
                            <Notification 
                                key={index}
                                date={notification.date}
                                message={notification.message}
                                action={notification.action}
                            />
                            <Divider />
                        </>
                    ))
                }
            </Feed>
        </Scrollbars>
    )
};



export default NotificationFeed;