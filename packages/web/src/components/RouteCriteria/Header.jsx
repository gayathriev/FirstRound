import React from 'react'
import Typography from '@mui/material/Typography';
import 'semantic-ui-less/semantic.less';
import PropTypes from 'prop-types'
import '../AdvancedSearchBar/index.css'
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

/**
 * 
 * @returns a header to the Route criteria segment
 *  
 * 
 * @param content - Displays a title to the segment
 * 
 * @param cancel - Fucntion to reset all states
 *  
 */



const Header = ({
    content, cancel, 
    }) => {
	
	return (
		<Stack direction="row" style={{textAlign: 'right', marginTop: '2%'}} spacing={2}>
			<Typography variant="h6" gutterBottom component="div">
				{content}
			</Typography>
				<Button variant="contained" startIcon={<CancelIcon />} onClick={e => cancel(e)}
					style={{
						borderRadius: 15,
						backgroundColor: "#377f89",
						color: 'white',
						marginLeft: 'auto'
					}}
				>
					Cancel
			</Button>
		</Stack>
    );
};

export default Header;


Header.propTypes = {
    content: PropTypes.string,
    cancel: PropTypes.func,
}