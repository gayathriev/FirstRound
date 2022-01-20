import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import './index.css';

const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
];

/**
 * 
 * @param openingHours 
 * @returns returns a formatted
 * version of trading or available
 * hours to render on menu pages
 * and venue cards. 
 */
const OpeningHours = ({openingHours, title, special, menuInfo}) => {
    return (
        <div className='opening-hours'>
            {title && <Typography variant='h6'> Opening Hours: </Typography>}

            {
                days.map((day, index) => {
                    const trading = openingHours.find(hour => hour.day === day);
                    
                    if (trading) {
                        return (
                            <Stack 
                                key={index}
                                direction="row"
                                alignItems="left"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Box>
                                    <Typography color="text.secondary"> 
                                        {trading.day} 
                                    </Typography> 
                                </Box>
                                <Box>
                                    <Typography color="text.secondary">
                                        {String(trading.open.hours).padStart(2, '0')}:
                                        {String(trading.open.minutes).padStart(2, '0')} 
                                        <> - </> 
                                        {String(trading.close.hours).padStart(2,'0')}:
                                        {String(trading.close.minutes).padStart(2, '0')}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    } else {
                        return (
                            <Stack 
                                key={index}
                                direction="row"
                                justifyContent="space-between" 
                            >
                                <Box sx={{ mr: 2 }}>
                                    <Typography color="text.secondary">
                                        {day} 
                                    </Typography>
                                </Box>
                                <Box sx={{ mr: 0.3  }} >
                                    <Typography color="text.secondary">
                                        {(special || menuInfo) ? 'Closed' : 'Not Available'}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    } 
                })  
            }
        </div>
    )
};

OpeningHours.propTypes = {
    openingHours: PropTypes.array,
    title: PropTypes.bool
};

export default OpeningHours;