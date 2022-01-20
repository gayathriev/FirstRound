import React from 'react';
import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

/**
 * returns a vertical separator 
 * bar to display between route
 * cards. If the separator is
 * for the last card, it will 
 * not be bi-directional. 
 * 
 * @prop addHandler - a function to be 
 *       called when the add button is 
 *       clicked
 * @prop last - boolean indicating if
 *       this is a splitter for the 
 *       last card
*/
const CardSplitter = ({ index, addHandler, last }) => {
    return (
        <Box
            sx={{
                mt: -2,
                mb: -2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Timeline >
                <TimelineItem>
                    <TimelineSeparator>

                        { !last && <TimelineConnector sx={{ height: 20 }} /> }

                        {/* <TimelineDot onClick={addHandler}>
                            <IconButton aria-label="add" size="small">
                                <AddIcon fontSize="inherit"/>
                                { index + 1}
                            </IconButton>
                        </TimelineDot> */}
                        
                        { !last && <TimelineConnector sx={{ height: 20 }}/> }
                    
                    </TimelineSeparator>
                </TimelineItem>
            </Timeline>
        </Box>
    )
};



export default CardSplitter;