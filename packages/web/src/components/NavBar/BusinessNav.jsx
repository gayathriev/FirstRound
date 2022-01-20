import React from 'react';
import AppBar from '@mui/material/AppBar';

import { NavBar } from './NavBar';

/**
 * 
 * @returns a nav bar that
 * wraps the regular navbar
 * using mui's AppBar
 * component to handel the
 * z-index expansion
 * required to properly
 * render the business dashboard.
 */
const BusinessNav = () => {
    return (
        <AppBar 
            enableColorOnDark
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                // minHeight: 80,
                backgroundColor: 'transparent',
            }}
        >
            <NavBar />
        </AppBar>
    )
};



export default BusinessNav;