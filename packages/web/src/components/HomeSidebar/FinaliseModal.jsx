import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_ROUTE } from '../../gql/routes/saveRoute.gql';
import Box  from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AlertBar from '../../shared-components/AlertBar';
import FormControl from '@mui/material/FormControl';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


/**
 * 
 * @param show - boolean to show or
 * hide the modal
 * 
 * @param setShow - function to set the
 * show state
 * 
 * @param setFinalising - function to set the
 * finalising state
 * 
 * @param setRouteID - function to set the
 * routeID state
 * 
 * @param setShareRoute - function to set the
 * shareRoute state
 * 
 * @param routeVenues - array of venues
 * 
 * 
 * @todo
 * 
 * + set routeGeometry To Null on save 
 */
const FinaliseModal = ({ 
    show, 
    setShow, 
    setFinalising,
    setRouteID,
    setShareRoute,
    routeVenues,
    routeName,
    setRouteName,
    routeData,
    clearRoutePlan,
}) => {
    // extract _id from each venue in route
    const routeVenuesIDS = routeVenues.map(venue => venue._id);
    const handleRouteName = (event) => setRouteName(event.target.value);
    const [showAlert, setShowAlert ] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [saveRoute, {loading, error, data}] = useMutation(
        SAVE_ROUTE,
        {
            onCompleted: (data) => {

                // check for errors
                if (data.saveRoute.errors) {
                    setAlertMessage('Failed to save route please try again!');
                    setAlertSeverity('error');
                    setShowAlert(true);
                    setFinalising(false);
                    return;
                }

                setRouteID(data.saveRoute.content._id);
                setAlertMessage('Route Saved!');
                setAlertSeverity('success');
                setShowAlert(true);

                // clear route plan
                clearRoutePlan();

                // display share modal
                setShareRoute(true);
                setShow(false);
                setFinalising(false);
            }
        }
    );

    const handleClose = () => {
        setShow(false);
        setFinalising(false);
    };

     // fire mutation -> alert -> setRouteID
    const handleSave = () => {

        // tmp hardcode of polyline
        saveRoute({
            variables: {
                route: {
                    name: routeName,
                    venuesInRoute: routeVenuesIDS,
                    routeGeometry: routeData.content.routeGeometry
                }
            }
        })
    }

    if (loading)
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )

    return (
       <Box>
            <Dialog
                open={show}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="finalise-dialog"
            >
                <DialogTitle>
                    Finalise Route
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="finalise-dialog-description">
                        <FormControl 
                            variant='standard'  
                            sx={{
                                mt: 0.5, 
                                '& > :not(style)': { m: 1, width: '100%' }, 
                                '& .MuiTextField-root': { m: 0.5, width: '32ch' },
                                width: '100%' 
                            }}
                        >
                            <Typography variant="subtitle1">
                                Name your route
                            </Typography>
                            <TextField 
                                id="outlined-search" 
                                required
                                label="Route name" 
                                type="search" 
                                value={routeName}
                                onChange={handleRouteName}
                            />            
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error" 
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained" 
                        color="success"
                        disabled={routeName.length < 1}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <AlertBar 
                show={showAlert}
                setShow={setShowAlert}
                message={alertMessage}
                severity={alertSeverity}
            />
       </Box>
    )
};



export default FinaliseModal;