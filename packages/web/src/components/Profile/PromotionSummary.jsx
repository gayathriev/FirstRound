import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


/** 
 * Provides a summary on the promotion that exists
 * 
 * @param index
 * 
 * @param venueName
 * 
 * @returns 
 */
const PromotionSummary = ({
    index,
    venueName,
    validFrom,
    validTo,
}) => {
    return (
        <Paper 
            elevation={3}
            sx={{
                mb: 2
            }}
        >
            <Box 
                p={2} 
                display="flex"
                alignItems="baseline"
                justifyContent="space-between" 
            >
                <Typography variant="h7">
                    {index}. {venueName}
                </Typography>
                <Typography variant="subtitle" color="text.secondary">
                    {new Date(validFrom).toLocaleDateString()} 
                    <span> - </span> 
                    {new  Date(validTo).toLocaleDateString()}
                </Typography>
            </Box>
        </Paper>
    )
};



export default PromotionSummary;