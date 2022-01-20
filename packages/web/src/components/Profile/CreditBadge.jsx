import React from 'react';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import BoltIcon from '@mui/icons-material/Bolt';

/**
 * 
 * @returns a badge that has the
 * users credit valueo on it
 * 
 * @param creditScore credit number to be displayed
 * 
 */


const CreditBadge = ({
    creditScore
}) => {
    return (
        <Container
            sx={{
                display: 'flex',
                mt: 1
            }}
        >
            <Box
                m="auto"
            >
                <Chip
                    label={`Credits ${creditScore}`}
                    variant="outlined"
                    icon={<BoltIcon />}
                />
            </Box>
        </Container>
    );
};



export default CreditBadge;