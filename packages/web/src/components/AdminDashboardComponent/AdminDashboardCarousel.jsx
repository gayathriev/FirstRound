import React, { useState } from 'react';
import {
	Button,
	Header,
	Icon,
	Segment,
	Grid,
	Card,
	Label,
    Container,
} from 'semantic-ui-react'
import { RejectVenueRequestModal } from './RejectVenueRequestModal';
import '../../styles/auth.css';

// JavaScript's `%` operator is for remainder, not modulo
const mod = (n, m) => {
	return ((n % m) + m) % m;
};

/**
 * Displays a carousel of pending
 * venue requests for all businesses
 * making applications across the platform.
 * 
 * @param props  
 */
export const AdminDashboardCarousel = (props) => {
	const [currentBusiness, setCurrentBusiness] = useState(0);
    const { businessList, updateCallback } = props;

    const approveRequest = () => {
        // this is a deeply hacky workaround, but I need to think more carefully
        // about how to handle all the delays, etc.
        if (businessList.length > 1) {
            setCurrentBusiness(mod(currentBusiness, businessList.length - 1));
        } else {
            setCurrentBusiness(0);
        }
        updateCallback({
            variables: {
                decision: "APPROVED",
                requestID: businessList[currentBusiness]._id,
            },
        });
    }

    const rejectRequest = (comment) => {
        if (businessList.length > 1) {
            setCurrentBusiness(mod(currentBusiness, businessList.length - 1));
        } else {
            setCurrentBusiness(0);
        }
        updateCallback({
            variables : {
                decision: "REJECTED",
                requestID: businessList[currentBusiness]._id,
                comment,
            },
        });
    }

    // Sorry @Angus, breaking this into more components (great idea!) would
    // be really annoying
    if (businessList.length === 0) {
        // setCurrentBusiness(0);
        return (
            <Container text>
                <Header>You have processed all requests!</Header>
                <p>
                    Reload the page to see if there are new venue requests.
                </p>
            </Container>
        );
    }
 
	return (
		<Grid columns='equal'>
			<Grid.Row>
				<Grid.Column verticalAlign='middle'>
					<Button
						size='massive'
						circular
						floated='right'
						icon={<Icon name='chevron left' />}
						onClick={() => setCurrentBusiness(mod(currentBusiness - 1, businessList.length))}
					/>
				</Grid.Column>

				<Grid.Column width={8}>
					<Card fluid centered={true}>
						<Card.Content>
							<Card.Header>
								Validate Business
							</Card.Header>
							<Segment.Group>
								<Segment>
									<Label align='left' attached='top'><Icon name='user' /> Claimant</Label>
									<div align='left'>
										{businessList[currentBusiness].claimant.username}
									</div>
								</Segment>
								<Segment >
									<Label align='left' attached='top'><Icon name='map marker alternate' />Venue</Label>
									<div align='left'>
										{businessList[currentBusiness].venue.name}
									</div>
								</Segment>
								<Segment>
                                    <Label align='left' attached='top'><Icon name='file' />Verification Documents</Label>
                                    <div align='left'>
                                        <a href={businessList[currentBusiness].verificationDocuments} target='_blank' rel='noopener noreferrer'>
                                            <Icon.Group size='massive'>
                                                <Icon name='file pdf outline' />
                                                <Icon corner size='tiny' name='download' />
                                            </Icon.Group>
                                            <br />
                                            Click to download
                                        </a>
                                    </div>
									
								</Segment>
                                <Segment>
                                    <Button.Group fluid>
										<RejectVenueRequestModal 
                                            completeRejection={rejectRequest}
                                        />
										<Button.Or />
										<Button 
                                            onClick={approveRequest}
                                            positive
                                        >
                                            Approve
                                        </Button>
									</Button.Group>
                                </Segment>
							</Segment.Group>
						</Card.Content>
					</Card>
				</Grid.Column>
				
				<Grid.Column verticalAlign='middle'>
					<Button
						size='massive'
						circular
						floated='left'
						icon={<Icon name='chevron right' />}
						onClick={() => setCurrentBusiness(mod(currentBusiness + 1, businessList.length))}
					/>
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};
