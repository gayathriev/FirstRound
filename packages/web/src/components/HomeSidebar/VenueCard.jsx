import React, { useState } from 'react';
import { 
    Label, 
    Card, 
    Image, 
    Icon,
    Button,
    Popup
} from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { clientUrl } from '../../constants/urls';
import PropTypes from 'prop-types';
import { 
    cafeLogo, 
    barLogo, 
    restaurantLogo 
} from '../../constants/venueImages';
import Typography from '@mui/material/Typography';
import PrimaryButton from '../../shared-components/primary-button/PrimaryButton';
import ShareModal from './ShareModal';
import CardOpeningHours from './CardOpeningHours';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import './index.css';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';

/**
 * Render a card representing key 
 * information about a venue including
 *  - name
 *  - associated tags
 *  - trading hours  
 *  - location/address
 * 
 * @prop venue - data about the venue
 * @prop authenticated - user authenticated state
 *  as determined by get self 
 */
const VenueCard = ({
    index,
    removeHandler,
    addHandler, 
    routePlanner,
    venue, 
    authenticated,
    existing
}) => {

    const history = useHistory();
    const [ showModal, setShowModal ] = useState(false);

    let venueLogo;
    switch (venue.venueType) {
        case "BAR":
            venueLogo = barLogo;
            break;
        case "CAFE":
            venueLogo = cafeLogo;
            break;
        case "RESTAURANT":
            venueLogo = restaurantLogo;
            break;
        default:
            venueLogo = cafeLogo;
    }

    // trigger the router to mount venue page
    const venueMenuRoute = (venueID) => {
        history.push({
                pathname: `/menu/${venueID}`,
                id: venueID,
        })
    }

    const handleShare = () => {
        console.log(`sharing venue ${venue._id}`);
        setShowModal(true);
    }

    const copyLink = () => {
        const link = `${clientUrl}/menu/${venue._id}`;
        navigator.clipboard.writeText(link);
    }

    return (
        <Box sx={{ mb: 2, mt: 2 }} >
            <Stack direction="row">
                {routePlanner &&
                    <Box 
                        sx={{
                            alignSelf: 'center',
                        }}
                    >
                        <IconButton onClick={() => removeHandler(index)}>
                            <RemoveCircleIcon />
                        </IconButton>
                    </Box>
                }
                <Card fluid >
                    <Card.Content>
                        <Image
                            floated='left'
                            size='tiny'
                            src={venueLogo}
                        />
                        {
                            authenticated ?
                            <Button 
                                floated='right'
                                icon='share' 
                                onClick={handleShare}
                            />
                            :
                            <Popup
                                content="Copy Link!" 
                                position='top center'
                                trigger={
                                    <Button 
                                        floated='right'
                                        icon='copy'
                                        onClick={copyLink}   
                                    />
                                }
                            />   
        
                        }
        
                        <ShareModal
                            openTrigger={showModal}
                            stateHandler={setShowModal}
                            type={'menu'}
                            shareID={venue._id}
                            shareName={venue.name}
                            title='Share Venue'
                            icon='share'
                        />

                        <Card.Header>
                            {venue.name}
                        </Card.Header>
                        <Card.Meta>
                            <CardOpeningHours hours={venue.openingHours.hours} />
                        </Card.Meta>
                        <Card.Description>
                            <Stack spacing={2}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {venue.tags && 
                                        venue.tags.map((tags, index) => (
                                            <Box sx={{ p: 0.2 }}>
                                                <Label 
                                                    key={index}
                                                    as='a' 
                                                    image
                                                    circular
                                                >
                                                    {tags.tag.text}
                                                </Label>
                                            </Box>
                                        ))
                                    }
                                </Box>
                                <Box>
                                    <PrimaryButton 
                                        onClick={() => {venueMenuRoute(venue._id)}}
                                        content='More Info'
                                    />
                                    { (!routePlanner && !existing) &&
                                        <Tooltip title="Add to route plan" arrow>
                                            <IconButton
                                                size="large" 
                                                onClick={() => addHandler(index)}
                                            >
                                                <AddCircleIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </Box>
                            </Stack>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                            <Icon name='location arrow' />
                            {venue.address}
                        </a>
                        <br />
                        <Typography variant="body1" component="a">
                            <Icon name='phone' />
                            {venue.contactNumber}
                        </Typography>
                    </Card.Content>
                </Card>
            </Stack>
        </Box>
    )
};


VenueCard.propTypes = {
    venue: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired
};

export default VenueCard;