import { useQuery, useMutation } from '@apollo/client';
import React from 'react';
import {
	Statistic,
	Header,
	Grid,
	Loader,
} from 'semantic-ui-react';
// handle mobile || small screens
import Box from '@mui/material/Box';
import { GET_REQUESTS_BY_STATUS } from '../../gql/venueRequests/getRequestsByStatus.gql';
import { UPDATE_REQUEST_STATUS } from '../../gql/venueRequests/updateRequestStatus.gql';
import { GET_USERS_COUNT, GET_BUSINESS_COUNT } from './getCounts.gql';
import { AdminDashboardCarousel } from './AdminDashboardCarousel';
import '../../styles/auth.css';

export const AdminDashboardComponent = () => {
	const userResults = useQuery(GET_USERS_COUNT);
	const businessResults = useQuery(GET_BUSINESS_COUNT);
	const { loading, error, data } = useQuery(GET_REQUESTS_BY_STATUS, {
		variables: {
			status: "PENDING",
		},
	});

	// Mutation for approving requests
	const [updateRequest, /*updateResults*/] = useMutation(UPDATE_REQUEST_STATUS, {
		refetchQueries: [
			{
				query: GET_REQUESTS_BY_STATUS,
				variables: {
					status: "PENDING",
				},
			},
		],
	});

	
	let mainDisplay;
	let pendingStats;
	if (loading || error) {
		mainDisplay = <Loader active inline='centered' />;
		pendingStats = <Loader active inline='centered' />;
	} else {
		mainDisplay = <AdminDashboardCarousel 
			businessList={data.getRequestsByStatus} 
			updateCallback={updateRequest}
		/>;
		pendingStats = data.getRequestsByStatus.length;
	}

	let userStats;
	if (userResults.loading || userResults.error) {
		userStats = <Loader active inline='centered' />;
	} else {
		console.log(userResults);
		userStats = userResults.data.getUsersCount.count;
	}

	let businessStats;
	if (businessResults.loading || businessResults.error) {
		businessStats = <Loader active inline='centered' />;
	} else {
		console.log(userResults);
		businessStats = businessResults.data.getBusinessCount.count;
	}
	
	return (
		<Box sx={{minWidth: 530, overflowX: 'scroll' }} >
			<Header textAlign='center' >
				Platform overview
			</Header>
			<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='top'>
				<Grid.Column style={{ maxWidth: '95vw' }} className="colClass circular">
					<div className="ui placeholder segment" textAlign='center'>
						<Statistic.Group widths='three'textAlign='center'>
							<Statistic>
								<Statistic.Label>Pending Requests</Statistic.Label>
								<Statistic.Value>
									{pendingStats}
								</Statistic.Value>
							</Statistic>

							<Statistic>
								<Statistic.Label>Businesses</Statistic.Label>
								<Statistic.Value>
									{businessStats}
								</Statistic.Value>
							</Statistic>

							<Statistic>
								<Statistic.Label>Users</Statistic.Label>
								<Statistic.Value>
									{userStats}
								</Statistic.Value>
							</Statistic>
						</Statistic.Group>
					</div>

					{mainDisplay}
					
				</Grid.Column>
			</ Grid>
		</Box>
	);
};

export default AdminDashboardComponent;
