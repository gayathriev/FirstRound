import * as React from "react";
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { ProcessMenuItem } from './processMenuItem.gql'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * Renders cards to depict unverified
 * menu items per venue in the queue
 * 
 * @param menuItem - a menu item object 
 * 
 * @param propVenueID - the ID of the venue
 * 
 * @param updateQueue - the update handler 
 * for the list of jobs
 */
const MenuItemCard = ({
    menuItem, 
    propVenueID, 
    updateQueue,
    refetchVenues
}) => {
    const [ approveMenuItem ] = useMutation(ProcessMenuItem);

    //approve item handler
    const approveItem = () => {
        approveMenuItem({
            variables: {
                decision: 
                "APPROVED",
                menuItemID: menuItem._id,
                venueID: propVenueID,
            }
        })
        
        updateQueue(menuItem._id);
        refetchVenues();
    }
    
    //reject item handler
    const rejectItem = () => {
        approveMenuItem({
            variables: {
                    decision: 
                    "REJECTED",
                    menuItemID: menuItem._id,
                    venueID: propVenueID,
            }
        })

        updateQueue(menuItem._id);
        refetchVenues();
    }


    return (
        <Box sx={{ minWidth: 200, maxWidth: 500, mt: 2, mb: 2 }} >
            <Card variant="outlined">
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography>
                            {menuItem.name}
                        </Typography>
                        <Typography>
                            ${menuItem.price}
                        </Typography>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        onClick={() => rejectItem()}
                        negative
                        variant="contained"
                        color="error"
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => approveItem()}
                        positive
                        variant="contained"
                        color="success"
                    >
                        Approve
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}


MenuItemCard.propTypes = {
    menuItem: PropTypes.object.isRequired,
    propVenueID: PropTypes.string.isRequired,
    updateQueue: PropTypes.func.isRequired
};


export default MenuItemCard;