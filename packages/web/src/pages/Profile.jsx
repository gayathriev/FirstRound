import React, { useState } from 'react'
import { NavBar } from '../components/NavBar/NavBar';
import {
  Loader,
  Dimmer
} from 'semantic-ui-react';
import { useQuery } from "@apollo/client";
import { GetSelf } from "../gql/self/getSelf.gql";
import { GET_PROFILE } from '../gql/self/profile.gql';
import { useHistory } from 'react-router-dom';
import ProfileBadge from '../components/ProfileBadge/ProfileBadge';
import Box from '@mui/material/Box';
import CreditBadge from '../components/Profile/CreditBadge';
import PromotionsFeed from '../components/Profile/PromotionsFeed';
import RoutesFeed from '../components/Profile/RoutesFeed';
import AccountDash from '../components/Profile/AccountDash';
import NavDial from '../components/Profile/NavDial';
import 'semantic-ui-less/semantic.less';
import { UserTypes } from '../constants/userTypes';
import { avatarEndpoint } from "../constants/urls";

const Profile = () => {
    const [username, setUsername] = useState('username');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userID, setUserID] = useState('');
    const [userType, setUserType] = useState('');
    const [credits, setCredits] = useState('');
    const [email, setEmail] = useState('');
    const [joinedDate, setJoinedDate] = useState('');
    const [activePromotions, setActivePromotions] = useState([]);
    const [futurePromotions, setFuturePromotions] = useState([]);
    const [expiredPromotions, setExpiredPromotions] = useState([]);
    
    // routes
    const [myRoutes, setMyRoutes] = useState([]);
    const [sharedRoutes, setSharedRoutes] = useState([]);

    const [page, setPage] = useState('Home');

    const history = useHistory();

    const  { loading, error, /*data*/ } = useQuery(
        GetSelf, 
        {
            onCompleted: (data) => {
                setUsername (data.getSelf.username);
                setUserID (data.getSelf.userID);
                setUserType (data.getSelf.userType);
                setAvatarUrl(
                    `${avatarEndpoint}/:${data.getSelf.username}.svg`
                );
            }
        },
    );

    const {loading: loadingProfile, error: errorProfile} = useQuery(
        GET_PROFILE,
        {
            onCompleted: (data) => {
                let customerData = data.getProfile;
                console.log("[>>] customer data", customerData);
                setCredits(customerData.credits);
                setActivePromotions(customerData.activePromotions);
                setFuturePromotions(customerData.futurePromotions);
                setExpiredPromotions(customerData.expiredPromotions);
                setEmail(customerData.email);
                setJoinedDate(customerData.joinedDate);
                setMyRoutes(customerData.myRoutes);
                setSharedRoutes(customerData.sharedRoutes);
            }
        }
    )


    if (error || errorProfile) {
        console.log(`[**] profile ${error}`);
        // redirect to home,
        // probably unauthenticated
        history.push('/');
    }

    if (loading || loadingProfile) {
        return (
            <Dimmer active>
                <Loader />
            </Dimmer>
        )
    }

    return (
        <Box style={{ height: "100vh" }}>
            <NavBar />
            <ProfileBadge 
                username={username}
                avatarUrl={avatarUrl}
            />
            {userType === UserTypes.CUSTOMER &&  
                <CreditBadge creditScore={credits}/>
            }

            <Box 
                sx={{ ml: 6 }}
            >
                {userType === UserTypes.CUSTOMER &&
                    page === 'Home' &&
                    <PromotionsFeed
                        userID={userID} 
                        activePromotions={activePromotions}
                        futurePromotions={futurePromotions}
                        expiredPromotions={expiredPromotions}
                    />
                }

                {userType === UserTypes.CUSTOMER &&
                    page === 'Routes' &&
                    <RoutesFeed 
                        myRoutes={myRoutes}
                        sharedWithMe={sharedRoutes}
                    />
                }

                {userType === UserTypes.BUSINESS &&
                    <AccountDash 
                        email={email}
                        joinedDate={joinedDate}
                    />
                }

                {page === 'Account' &&
                    <AccountDash
                        email={email}
                        joinedDate={joinedDate}
                    />
                }

            </Box>

            {userType === UserTypes.CUSTOMER &&
                <NavDial setPage={setPage}/>
            }
            
        </Box>
    );
}

export default Profile;