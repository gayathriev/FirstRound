import React, { useState } from 'react';
import { Search, Popup } from 'semantic-ui-react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SearchUser } from '../../gql/search/searchUser.gql';
import { ShareVenue } from '../../gql/venueInfo/shareVenue.gql';
import { SHARE_ROUTE } from '../../gql/routes/shareRoute.gql';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AlertBar from '../../shared-components/AlertBar';

import { clientUrl } from '../../constants/urls';

const hideAfter = 700;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * 
 * @param {*} openTrigger
 * @param {*} stateHandler
 * @param {*} title
 * @param {*} icon
 * @returns ShareModal
 * 
 * @description
 * 
 * display a modal for sharing
 * that takes in a title, icon for the
 * share 'wizard' and a setState
 * hook and a state to control it.
 * 
 * 
 * @todo 
 * 
 * + make more generic
 *   for route sharing
 */
const ShareModal = ({
    openTrigger,
    stateHandler,
    type,
    title,
    shareID,
    shareName
}) => {
    // make prop to use dynamically
    let popupText = 'Copied Share Link!';
    const [ isOpen, setIsOpen ] = useState(false);
    const [ timeout, setTimeoutHandler ] = useState('');
    const [ searchFragment, setSearchFragment ] = useState('');
    const [ selectedUsers, setSelectedUsers ] = useState([]);

    // alert bar states
    const [ alertMessage, setAlertMessage ] = useState('');
    const [ severity, setSeverity ] = useState('');
    const [ show, setShow ] = useState(false);


    const [ shareVenue ] = useMutation(ShareVenue,
        {
            onCompleted: (data) => {
                if (data.shareVenue) {
                    setSelectedUsers([]);
                    setAlertMessage(`Venue shared!`);
                    setSeverity('success');
                    setShow(true);
                    stateHandler(false);
                } else {
                    setAlertMessage(
                        `Failed to share, please refresh and try again!`
                    );
                    setSeverity('error');
                    setShow(true);
                }
            }
        }
    );
    const [ searchUser, { loading, error, data }] = useLazyQuery(SearchUser, {
        variables: {
            usernameFragment: searchFragment
        }
    });

    // share route
    const [ shareRoute ] = useMutation(SHARE_ROUTE,
        {
            onCompleted: (data) => {
                if (data.shareRoute) {
                    setSelectedUsers([]);
                    setAlertMessage(`Route shared!`);
                    setSeverity('success');
                    setShow(true);
                    stateHandler(false);
                } else {
                    setAlertMessage(
                        `Failed to share, please refresh and try again!`
                    );
                    setSeverity('error');
                    setShow(true);
                }
            }
        }
    );


    const handleSearch = (fragment) => {
        setSearchFragment(fragment);
        if (fragment.length > 1)
            searchUser();
    }

    const handleOpen = () => {
        setIsOpen(true)

        setTimeoutHandler(
            setTimeout(() => {
                setIsOpen(false)
            }, hideAfter)
        )
    }

    const handleClose = () => {
        setIsOpen(false);
        clearTimeout(timeout)
    }

    const handleCloseDialog = () => {
        setSelectedUsers([]);
        stateHandler(false);
    }

    const removeUser = (targetUser) => {
        setSelectedUsers(
            (userChips) => userChips.filter((user) => user.key !== targetUser.key)
        );
    }

    const selectUser = (e, { result }) => {
        console.log("[>>] selected  => ", result.title);

        // check if the user was already selected
        if (selectedUsers.find((user) => user.text === result.title)) {
            setAlertMessage(`User already selected!`);
            setSeverity('warning');
            setShow(true);
            return;
        }
            

        // append selected user to head of selectedUsers
        setSelectedUsers((prevSelected) => [
            {
                key: prevSelected.length,
                text: result.title,
            },
            ...prevSelected
        ]);

        // clear search
        setSearchFragment('');
    }

    const copyLink = () => {
        const link = `${clientUrl}/${type}/${shareID}`;
        navigator.clipboard.writeText(link);
    }

    // todo make conditional query
    const handleShare = () => {

        if (selectedUsers.length > 0 && type === 'menu') {
            selectedUsers.forEach((user) => {
                shareVenue({
                    variables: {
                        recipient: user.text,  // username selected
                        venue: shareName,
                        venueID: shareID,
                    }
                });
            });
        }

        if (selectedUsers.length > 0 && type === 'route') {
            selectedUsers.forEach((user) => {
                shareRoute({
                    variables: {
                        recipient: user.text,  // username selected
                        route: shareName,
                        routeID: shareID,
                    }
                });
            });
        }
    }


    let matchingUsers = []

    if (error)
        console.log("[>>] got error", error);

    if (data) {
        if (data.searchUsers.length > 0) {
            for (let idx = 0; idx < data.searchUsers.length; idx++) {
                matchingUsers.push({
                    title: data.searchUsers[idx].username,
                });
            }
        }
    }


    return (
        <>
            <Dialog
                open={openTrigger}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="share-dialog"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Stack direction="row" spacing={3}>
                        <Box
                            sx={{ mb: 25 }}
                        >
                            <Search
                                fluid
                                size='large'
                                input={{ iconPosition: 'left' }} 
                                placeholder='Search user ...'
                                loading={loading}
                                onResultSelect={selectUser}
                                isLoading={loading}
                                results={matchingUsers}
                                value={searchFragment}
                                onSearchChange={event => handleSearch(event.target.value)}
                            />
                        </Box>
                        <Box>
                            <Popup 
                                content={popupText}
                                position='top center'
                                on='click'
                                trigger={
                                    <IconButton
                                        icon='copy'
                                        onClick={copyLink}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                }
                                open={isOpen}
                                onClose={handleClose}
                                onOpen={handleOpen}
                            />
                        </Box>
                    </Stack>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            maxWidth: 400
                        }}
                    >
                        { 
                            selectedUsers.map(user => (
                                <Box sx={{p: 0.5}}>
                                    <Chip
                                        key={user.key}
                                        label={user.text}
                                        onDelete={() => removeUser(user)}
                                    />
                                </Box>
                            ))
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseDialog}
                        color='error'
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleShare}
                        disabled={selectedUsers.length === 0}
                        color='success'
                        variant='outlined'
                    >
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
            <AlertBar
                show={show}
                setShow={setShow}
                message={alertMessage}
                severity={severity}
            />
        </>
    )
};

ShareModal.propTypes = {
    openTrigger: PropTypes.bool.isRequired,
    stateHandler: PropTypes.func.isRequired,
};

export default ShareModal;