import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns'

/**
 * Renders a venues trading hours for
 * the current day or indicates that
 * the venue is closed on the current
 * day
 * 
 * @prop hours - the venues trading hours
 */
const CardOpeningHours = ({ hours }) => {
    const today = format(new Date(), "eeee");
    // attempt to match today in hours
    const todaysHours = hours.find((hour) => hour.day === today)
    if (todaysHours)
        return (
            <Stack direction="row" spacing={0.5}>
                <Box>
                    <Typography> 
                        {todaysHours.day} 
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        {String(todaysHours.open.hours).padStart(2, '0')}:
                        {String(todaysHours.open.minutes).padStart(2, '0')} 
                        <> - </> 
                        {String(todaysHours.close.hours).padStart(2, '0')}:
                        {String(todaysHours.close.minutes).padStart(2, '0')}
                    </Typography>
                </Box>
            </Stack>
        )
    else
        return (
            <Typography >
                { today } Closed
            </Typography>
        ) 
};



export default CardOpeningHours;