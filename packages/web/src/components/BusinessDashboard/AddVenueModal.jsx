import React, { useState } from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import {
	Button,
	// Modal,
    Icon,
    Segment,
    Label,
    Loader,
    Dropdown,
} from 'semantic-ui-react'
import { uppy } from '../FileUpload/uppyConfig';
import PrimaryButton from '../../shared-components/primary-button/PrimaryButton';
import { GET_ALL_VENUES } from './getAllVenues.gql';
import VerificationUpload from '../FileUpload/VerificationUpload';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const queryToDropdownOptions = (venuesFound) => {
    let results = [];
    for (let venue of venuesFound) {
        results.push({
            key: venue._id,
            value: venue._id,
            text: venue.name,
        });
    }
    return results;
}


const style = {
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
    bgcolor: 'background.paper',
    position: 'fixed',
    minWidth: '70%',
    maxWidth: '80%',
    top: '50%',
    left: '50%',
};


export const AddVenueModal = (props) => {
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_ALL_VENUES,
        {
            notifyOnNetworkStatusChange: true,
        },
    );
    const [open, setOpen] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [venueID, setVenueID] = useState('');
    const [fileID, setFileID] = useState('');


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let mainDisplay;
    if (loading || error || (networkStatus === NetworkStatus.refetch)) {
        mainDisplay = <Loader active inline='centered' />;
    } else {
        mainDisplay = (
            <Box sx={style}>
                <Segment textAlign='center'>
                    <Label attached='top'>Step 1: Select venue</Label>
                    <Dropdown
                        fluid
                        placeholder="Search for a venue"
                        search
                        selection
                        clearable
                        options={queryToDropdownOptions(data.getAllVenues)}
                        onChange={(event, { value }) => {
                            setVenueID(value);
                        }}
                    />
                </Segment>
                
                <Segment hidden={venueID === ''} textAlign='center'>
                    <Label attached='top'>Step 2: Upload verification documents</Label>
                    <VerificationUpload 
                        venueID={venueID}
                        setShowCallback={setShowUpload}
                        setFileCallback={setFileID}
                        refetchQuery={props.startRefetchPending}
                    />
                    <br />
                </Segment>

                <Segment hidden={!showUpload} textAlign='center'>
                    <PrimaryButton content="Upload" onClick={() => {
                            uppy.upload();
                            setVenueID('');
                            setFileID('');
                            setShowUpload(false);
                            setOpen(false);
                        }} 
                    />
                </Segment>
            </Box>
        );
    }


    return (
        <>
            <Modal
                onClose={() => {
                    uppy.removeFile(fileID);
                    setVenueID('');
                    setFileID('');
                    setOpen(false);
                }}
                onOpen={() => {
                    refetch();
                    setOpen(true);
                }}
                open={open}
            >
                {mainDisplay}
            </Modal>
            <Button onClick={handleOpen}>
                <Icon circular name='add' />
                Add Venue
            </Button>
        </>
    );
}