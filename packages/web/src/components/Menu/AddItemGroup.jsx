import React, { useState } from 'react';
import { 
    Menu,
    Button,
    Popup
} from 'semantic-ui-react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Returns a two buttons one for triggering
 * the menu addition flow and one for representing
 * the prospective credit gain.
 * 
 * @prop trigger 
 * @prop credit 
 * 
 */
const AddItemGroup = ({ trigger, credits }) => {
    const [open, setOpen] = useState(false);
    const showInfoDialog = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const isWide = useMediaQuery('(max-width: 981px)');

    return (
        <Box
            sx={{
                flex: '2',
                mr: '2%'
            }}
        >
            <Menu.Menu className='add-item'> 
                <Menu.Item>
                    <Popup
                        content='Credits to earn'
                        trigger={
                            <Button
                                // circular
                                label={{as: 'p', pointing: 'left', content: `+ ${credits}`}} 
                                floated='right'
                                icon='trophy'
                                labelPosition='right'
                                onClick={showInfoDialog}
                            />
                        
                        } 
                    />
                </Menu.Item>
                <Menu.Item>
                    {isWide ?
                        <Button
                            floated='right'
                            icon='plus'
                            onClick={trigger}
                        />
                        : 
                        <Button 
                            floated='right'
                            icon='add' 
                            circular
                            content='Add an Item'
                            onClick={trigger}
                        />
                    }
 
                </Menu.Item>

            </Menu.Menu>   


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogTitle>{"What are Credits?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="info-modal">
                        Earn credits by adding menu items items 
                        to venues on FirstRound. 

                        Credits can be used to redeem promotions
                        which give you discounts at participating 
                        venues.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                    >
                        Sweet!
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};



export default AddItemGroup;