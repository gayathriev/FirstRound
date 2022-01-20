import React from 'react';
import { useQuery } from '@apollo/client';
import {
	Header,
    Container,
} from 'semantic-ui-react'
import { GET_MY_PENDING_REQUESTS } from './getMyRequests.gql';
import SideNav from './SideNav';

export const BusinessDashboardComponent = () => {
    const pendingResults = useQuery(GET_MY_PENDING_REQUESTS, {
        notifyOnNetworkStatusChange: true,
    });

    return (
        <Container textAlign='left'>
            <SideNav pendingResults={pendingResults}/>
        </Container>
    );
};