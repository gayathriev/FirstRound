import React, { useState } from 'react';
import Box from '@mui/material/Box';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

// apply custom styles, this is the least
// intuitive thing ive ever seen
const ToggleButton = styled(MuiToggleButton)(({
    borderRadius: 15,
    '&.Mui-selected, &.Mui-selected:hover': {
        color: 'white',
        backgroundColor: '#177E89',
    },
}));

/**
 * Renders a button group with a toggle button 
 * for each of the three sidebar views:
 * 
 *  + featured
 *  + search results
 *  + route plan
 */
const TopMenu = ({ setActivePanel, activePanel }) => {

    const handleChange = (event, newAlignment) => {
        if (!newAlignment)
            return;

        setActivePanel(newAlignment);
    };

    // opt for small toggle group
    // to support smaller screens
    return (
        <Box>
            <ToggleButtonGroup
                fullWidth
                size="small"
                value={activePanel}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton value="featured">
                    Featured
                </ToggleButton>
                <ToggleButton value="searchResults">
                    Search Results
                </ToggleButton>
                <ToggleButton value="routePlan">
                    Route Plan
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};



export default TopMenu;