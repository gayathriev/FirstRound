import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AlertBar from '../../shared-components/AlertBar';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILE } from '../../gql/self/profile.gql';
import { REDEEM_PROMOTION } from '../../gql/self/redeemPromotion.gql';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Shows a form from which
 * the user can redeem a 
 * promotion.
 * 
 * @param 
 * @returns RedeemPromotion 
 * 
 * @todo
 * 
 * + refetch the profile
 *   after successful redemption
 *   to update the balance and
 *   eligibility
 */
const RedeemPromotion = ({ 
    open,
    setOpenRedeem,
    venueID,
    creditsRequired,
    percentageOff,
    startDate,
    endDate
 }) => {
    
    const [ credits, setCredits ] = useState(0);
    const [ showAlert, setShowAlert ] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState('');
    const [ alertType, setAlertType ] = useState('');

    const { 
        loading: loadingProfile, 
        error: errorProfile, 
        data: profileData,
        refetch: refetchProfile
    } = useQuery(GET_PROFILE, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => setCredits(data.getProfile.credits)
    });

    const [ redeemPromotion, { loading: loadingRedeem} ] = useMutation(
        REDEEM_PROMOTION, 
        {
            onCompleted: async (data) => {
                console.log(`[>>] redeem got ${data.redeemPromotion.success}`);
                if (data.redeemPromotion.success) {
                    setAlertMessage('Promotion successfully saved to profile');
                    setAlertType('success');
                    setShowAlert(true);
                    refetchProfile(); 
                    setOpenRedeem(false);
                } else {
                    setAlertMessage('Redeem failed, please try again!');
                    setAlertType('error');
                    setShowAlert(true);
                }
            }
        }
    );


    const handleRedeem = () => {
        redeemPromotion({ variables: { venueID } });
        setOpenRedeem(false);
    }

    if (loadingProfile || loadingRedeem) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingProfile}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenRedeem(false)}
            >
                <DialogTitle>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h6">
                            Redeem Promotion
                        </Typography>

                        <Typography variant="subtitle1">
                            Available {
                                new Date(startDate).toLocaleDateString()
                            } - {
                                new Date(endDate).toLocaleDateString()
                            }
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="body1">
                            Earn {percentageOff}% off select 
                            menu items when you redeem this 
                            promotion for {creditsRequired} credits.
                        </Typography>

                        <Typography variant="body1">
                            You currently have {credits} credits 
                            {credits >= creditsRequired ? 
                                ` and will have ${credits - creditsRequired} credits remaining
                                after redeeming` 
                                : ' and cannot redeem the promotion'
                            }.
                        </Typography>
                    </DialogContentText>
                        <DialogActions>
                            <Button 
                                onClick={() => setOpenRedeem(false)}
                                variant="contained"
                                color="error"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleRedeem}
                                variant="contained"
                                color="success"
                                disabled={credits < creditsRequired}
                            >
                                Redeem!
                            </Button>
                        </DialogActions>
                </DialogContent>
            </Dialog>
            <AlertBar
                show={showAlert}
                setShow={setShowAlert}
                message={alertMessage}
                severity={alertType}
            />
       </>
    )
};


export default RedeemPromotion;