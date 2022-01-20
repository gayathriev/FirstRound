import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import RedeemPromotion from './RedeemPromotion';

/**
 * Displays information about
 * a venues promotion and acts
 * as a handler for the redeem
 * promotion dialog.
 * 
 * @param authenticated
 * @param promotion
 * 
 * @todo 
 * 
 * + make onclick redirect to login
 * page if user is not logged in
 */
const PromotionSection = ({ promotion, venueID }) => {

    const { creditsRequired, endDate, percentageOff, startDate } = promotion;

    const [openRedeem, setOpenRedeem] = useState(false);

    const handleRedeem = () => {
        console.log('[>>] Redeeming promotion');
        setOpenRedeem(true);
    }

    return (
       <Box sx={{  marginLeft: '5%' }} >
           <Tooltip
                arrow 
                title={`Promotion! ${percentageOff}% off selected menu items`}
            >
            <Chip 
                    icon={<CardGiftcardIcon />} 
                    label={`${percentageOff}% off`}
                    onClick={handleRedeem}
                />
            </Tooltip>

            <RedeemPromotion 
                open={openRedeem}
                setOpenRedeem={setOpenRedeem}
                venueID={venueID}
                creditsRequired={creditsRequired}
                endDate={endDate}
                percentageOff={percentageOff}
                startDate={startDate}
            />
       </Box>
    )
};



export default PromotionSection;