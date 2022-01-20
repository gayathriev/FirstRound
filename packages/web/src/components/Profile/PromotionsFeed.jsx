import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import PromotionSummary from './PromotionSummary';
import PromotionCard from './PromotionCard';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';


/**
 * 
 * @returns a list of promotions
 * in sets of accordion panels
 * one for the active promotions
 * and one for future and one 
 * for expired. Similar in
 * fashion to the routes
 * summary
 * 
 * @param myRoutes - user generated routes
 * 
 * @param sharedWithMe - routes shared to the user
 */


const PromotionsFeed = ({
    userID,
    activePromotions,
    futurePromotions,
    expiredPromotions,
}) => {
    return (
       <Container
            sx={{
                display: 'flex',
                mt: 8,
                // minWidth: '320px'
            }}
       >
            <Stack 
                spacing={2} 
                m='auto'
                width='100%'
                minWidth={250}
                maxWidth={500}
            >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            Current Promotions 
                            <Tooltip 
                                title="Show coupons at venues to redeem" 
                                placement="top"
                                arrow 
                            >
                                <IconButton
                                    aria-label="info"
                                >
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                        </Typography>

                    </AccordionSummary>
                        <AccordionDetails>
                            {activePromotions.length > 0 && 
                                activePromotions.map((promotion, index) => (
                                    <PromotionCard 
                                        key={index}
                                        promotionID={promotion._id}
                                        userID={userID}
                                        venueName={promotion.venue.name}
                                        validFrom={promotion.startDate}
                                        validTo={promotion.endDate}
                                        percentageOff={promotion.percentageOff}
                                        menuItems={promotion.menuItems}
                                    />
                                ))
                            }
                        </AccordionDetails>
                </Accordion>   


                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            Upcoming Promotions
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {futurePromotions.length > 0 &&
                            futurePromotions.map((promotion, index) => (
                                <PromotionSummary
                                    key={index}
                                    index={index + 1}
                                    venueName={promotion.venue.name}
                                    validFrom={promotion.startDate}
                                    validTo={promotion.endDate}
                                />
                            ))
                        }
                    </AccordionDetails>
                </Accordion> 
            
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            Expired Promotions
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expiredPromotions.length > 0 &&
                            expiredPromotions.map((promotion, index) => (
                                <PromotionSummary
                                    key={index}
                                    index={index + 1}
                                    venueName={promotion.venue.name}
                                    validFrom={promotion.startDate}
                                    validTo={promotion.endDate}
                                />
                            ))
                        }
                    </AccordionDetails>
                </Accordion> 
            </Stack>
       </Container>
    )
};



export default PromotionsFeed;