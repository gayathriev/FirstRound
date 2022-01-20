import React from 'react';
// import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


const actions = [
  { icon: <HomeIcon />, name: 'Home' },
  { icon: <MapIcon />, name: 'Routes' },
  { icon: <ManageAccountsIcon />, name: 'Account' },
];

/**
 * 
 * @returns a speed dial component
 * to use as a navbar on the profile 
 * page
 */
const NavDial = ({ setPage }) => {
    const handleActionClick = (name) => {
        setPage(name);
    };

    return (
        // <Box sx={{ transform: 'translateZ(0px)' }}>
        <>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 25, left: 5 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => handleActionClick(action.name)}
                    />
                ))}
            </SpeedDial>
        </>   
    )
};



export default NavDial;