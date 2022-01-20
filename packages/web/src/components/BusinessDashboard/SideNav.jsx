import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import { AddVenueModal } from './AddVenueModal';
import { VenueDisplayAccordion } from './VenueDisplayAccordion';

const drawerWidth = 206;


/**
 * Displays the sidebar nav for the business 
 * homepage as well as mounting components
 * that must interconnect with the sidebar
 * to make it responsive. 
 * 
 * @prop pendingResults - apollo client query
 * instance
 * 
 */
const SideNav = ({ pendingResults }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const [ onHome, setOnHome ] = useState(true);
    const [ onVerification, setOnVerification ] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleHomeNav = () => {
        setOnVerification(false);
        setOnHome(true); 
    };

    const handleVerificationsNav = () => {
        setOnHome(false);
        setOnVerification(true);
    };


    const drawer = (
        <Box
            sx={{
                mt: '50%'
            }}
        >
        <Toolbar />
    
            <List>
                <ListItem 
                    button key='Home' 
                    selected={onHome}
                    onClick={handleHomeNav}
                >
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary='Home' />
                </ListItem>
                <ListItem 
                    button key='Verify Menu' 
                    selected={onVerification}
                    onClick={handleVerificationsNav}
                >
                    <ListItemIcon>
                        <DomainVerificationIcon />
                    </ListItemIcon>
                    <ListItemText primary='Menu Verifications' />
                </ListItem>
            </List>
        </Box>
    );



    return (
        <Box 
            sx={{ 
                mt: '150px',
                display: 'flex' 
            }}
        >
            <CssBaseline />
            
            <AppBar
                enableColorOnDark
                color=""
                position="fixed"
                sx={{
                    mt: '85px',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'white',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        My Venues
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{
                    mt: '85px', 
                    width: { sm: drawerWidth }, 
                    flexShrink: { sm: 0 } 
                }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        // Better performance on mobile.
                        keepMounted: true, 
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth 
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth 
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <VenueDisplayAccordion 
                    pendingResults={pendingResults}
                    stateProp={onVerification}
                />
                <br />
                { onHome &&                   
                    <AddVenueModal 
                        startRefetchPending={() => {
                            pendingResults.refetch();
                        }}
                    />
                }
            </Box>
        </Box>
    );
}


SideNav.propTypes = {
    pendingResults: PropTypes.func.isRequired
}

export default SideNav;