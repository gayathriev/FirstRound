import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

/**
 *
 * @returns Notifition button
 * with active (new) indicator
 * 
 * @param onclick - executes command 
 * @param active - passed active state
 */

const buttonStyle = {
    borderRadius: 100,
    backgroundColor: '#FFC328',
    padding: 1.6,

    '&: hover' : {
        backgroundColor: '#FFC328',
    }
}

const NotificationButton = ({
    onClick,
    active
}) => {
    return (
        <IconButton sx={buttonStyle} onClick={onClick}>
            <Badge variant={active ? "dot": ""} color="error">
                <NotificationsIcon sx={{ color: 'text.primary' }}/>
            </Badge>
        </IconButton>
    )
};



export default NotificationButton;