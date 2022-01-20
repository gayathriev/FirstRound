import React from "react";
import { Image } from 'semantic-ui-react';
import propTypes from 'prop-types';
import 'semantic-ui-less/semantic.less';


/**
 * Display a profile picture and
 * username on the users account.
 * 
 * @param username - username
 * 
 * @param avaterUrl - avarter to display for account
 */
 

const ProfileBadge = ({ username, avatarUrl }) => {

    return (
        <div className="profile-badge" align='center'>
            <Image 
                src={avatarUrl} 
                circular 
                size='small'
            />
            <h1>{username}</h1>
        </div>
    ); 
}


ProfileBadge.propTypes = {
    username: propTypes.string.isRequired
}


export default ProfileBadge;