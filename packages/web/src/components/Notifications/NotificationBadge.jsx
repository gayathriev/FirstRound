import React, { useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { 
    useSubscription, 
    useQuery 
} from '@apollo/client';
import { 
    SubNotificationsFeed, 
    GET_USR_NOTIFICATIONS 
} from '../../gql/self/notifications';
import NotificationButton from './NotificationButton';
import NotificationFeed from './NotificationFeed';

/**
 * @returns Notifition badge
 * sits in navbar for an authenticated user
 * 
 * Calls NotificationFeed and NotificationButton
 * to display
 * 
 */



const NotificationBadge = () => {

    const [ feed, updateFeed ] = useState([
        {
            message: "No notifications!",
            date: '',
            action: ''
        }
    ]);

    const [hasNotifications, setHasNotifications] = useState(false);
    const { data: subscriptionData, error: subscriptionErr } = useSubscription(
        SubNotificationsFeed, {
            variables: {},
            onSubscriptionData: ({ subscriptionData }) => {
                if (feed.length > 1) 
                    updateFeed((prevFeed) => [subscriptionData.data.feed, ...prevFeed]);
                else
                    updateFeed([subscriptionData.data.feed]); 

                setHasNotifications(true);
            }
        }
    );
    
    const { 
        data: usrNotifications, 
        loading: loadingUsrNotifications, 
        error: usrNotificationsErr 
    } = useQuery(GET_USR_NOTIFICATIONS,
        {
            onCompleted: (data) => {
                if (data.getNotifications.length > 0)
                    updateFeed([]);
                
                data.getNotifications.map(notification => 
                    updateFeed((prevFeed) => [...prevFeed, notification])
                );
            }
        }
    );

    
    if (subscriptionErr)
        console.log("[**] error", subscriptionErr);

    return (
        <>
            <Popup
                content={
                    <NotificationFeed feed={feed}/>
                }
                trigger= {
                    <NotificationButton active={hasNotifications}/>
                }
                on='click'
                onOpen={() => { setHasNotifications(false) }}
                position='bottom center'
            />
        </>
    )
};



export default NotificationBadge;