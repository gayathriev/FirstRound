import React, { useState, useEffect } from 'react';
import { 
    useQuery, 
    NetworkStatus, 
    useLazyQuery
} from '@apollo/client';
import {
    Icon,
    Loader,
    Segment,
    Label,
} from 'semantic-ui-react';
import { GET_MY_REJECTED_REQUESTS } from './getMyRequests.gql';
import { GET_MY_VENUES } from './getMyVenues.gql';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VenueMenu from './VenueMenu';
import ReviewVenueCarousel from './ReviewVenueCarousel';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AlertBar from '../../shared-components/AlertBar';

/**
 * Displays X to X
 * 
 * @param  pendingResults - a function to refetch
 * venues pending verification
 * @param  stateProp - a boolean to indicate 
 * which page the sidebar is currently set
 * to
 */
export const VenueDisplayAccordion = ({ pendingResults, stateProp }) => {
    const [ venues, setVenues ] = useState([]);
    const { loading, error, refetch: refetchVenues, data } = useQuery(GET_MY_VENUES, 
        {
            // network only
            fetchPolicy: "network-only",
            notifyOnNetworkStatusChange: true,
            onCompleted: (data) => {
                setVenues(data.getVenuesForSelf);
            }
        }
    );


    const rejectedResults = useQuery(GET_MY_REJECTED_REQUESTS);

    // setup alert bar state
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");

    // set component crate
    let verifiedVenues;
    if (loading || error) {
        verifiedVenues = <Loader active inline='centered' />;
    } else {

        verifiedVenues = venues.map((venue, index) => (
            <Accordion key={index}>
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>
                        {index + 1}. {venue.name}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <VenueMenu 
                        venue={venue} 
                        refetchVenues={refetchVenues}
                        setAlertMessage={setAlertMessage}
                        setSeverity={setSeverity}
                        setShow={setShow}
                    />
                </AccordionDetails>
            </Accordion>
        ));
    }

    let pendingVenues;
    if (
        pendingResults.loading 
        || pendingResults.error 
        || pendingResults.networkStatus === NetworkStatus.refetch
    ) {
        pendingVenues = <Loader active inline='centered' />;
    } else {
        
        pendingVenues = pendingResults.data.getMyRequestsByStatus.map((datum, index) => (
            <Typography>
                {index + 1}. {datum.venue.name}
            </Typography>
        ));
    }

    let rejectedVenues;
    if (rejectedResults.loading || rejectedResults.error) {
        rejectedVenues = <Loader active inline='centered' />;
    } else {
        rejectedVenues = rejectedResults.data.getMyRequestsByStatus.map((datum, index) => (
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>
                        {index + 1}. {datum.venue.name}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Segment.Group>
                        <Segment>
                            <Label attached='top'>Reason for rejection</Label>
                            <p>
                                {datum.reasonForRejection}
                            </p>
                        </Segment>
                        <Segment>
                            <Label attached='top'>
                                Review your verification details
                            </Label>
                            <div>
                                <a 
                                    href={datum.verificationDocuments} 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                >
                                    <Icon.Group size='massive'>
                                        <Icon name='file pdf outline' />
                                        <Icon corner size='tiny' name='download' />
                                    </Icon.Group>
                                    <br />
                                    Click to download
                                </a>
                            </div>
                        </Segment>
                    </Segment.Group>
                </AccordionDetails>
            </Accordion>
        ));
    }

    return (
        <Box>
            { !stateProp ? (
                <>
                    <Segment>
                        <Label attached='top'>Verified</Label>
                        {verifiedVenues}
                    </Segment>

                    <Segment>
                        <Label attached='top'>
                            Awaiting Verification
                        </Label>
                        <div>
                            {pendingVenues}
                        </div>
                    </Segment>

                    <Segment>
                        <Label attached='top'>
                            Rejected Requests
                        </Label>
                        <div>
                            {rejectedVenues}
                        </div>
                    </Segment>
                    </> 
                ) : (
                    <>
                        {venues ? (
                            <ReviewVenueCarousel
                                venuesList={venues}
                                refetchVenues={refetchVenues}
                            />
                            ): null
                        }
                    </>
                )
            }

            <AlertBar 
                message={alertMessage}
                severity={severity}
                show={show}
                setShow={setShow}
            />     
        </Box>
    );
}

VenueDisplayAccordion.propTypes = {
    pendingResults: PropTypes.func.isRequired,

}


export default VenueDisplayAccordion;