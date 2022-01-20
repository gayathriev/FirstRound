import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Shows a summary of a route shared with the 
 * user or one they saved.
 * 
 * @param index - The index of the route in 
 * the list
 * 
 * @param name - the routes name
 * 
 * @param id - the id of the route
 */
const RouteSummary = ({ index, name, id}) => {
    const history = useHistory();
    // handle view route
    const handleViewRoute = () => {
        history.push(`/route/${id}`);
    }

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
                sx={{
                    '&:hover': {
                        cursor: 'pointer'
                    }
                }}
                onClick={handleViewRoute}
            >
                <Typography
                    variant="h6"
                >
                    {index}.
                </Typography>
                <Typography variant="h6">
                    {name}
                </Typography>
                <Box >
                    <ArrowForwardIosIcon />
                </Box>
            </Box>
        </Paper> 
    )
};



export default RouteSummary;