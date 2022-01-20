import React from 'react'
import { 
	Grid, 
	Rating, 
	Segment,
} from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';
import AddMenuCard from '../AdvancedSearchBar/AddMenuCard';
import DropdownTagBar from '../AdvancedSearchBar/DropdownTagBar';
import Header from './Header';
import PropTypes from 'prop-types'
import '../AdvancedSearchBar/index.css'


/**
 * 
 * @returns a extensive searchbox with many criterias.
 *  
 * 
 * @param back - back function used to go to previous form state
 * 
 * @param confirm - confirm generate route
 * 
 * @param cancel - clear function used passed to Header
 * 
 * @param ratingStar - minimum rating value for search
 * 
 * @param setRatingStar - set minimum rating value for search
 * 
 * @param venueCondition - set venue condition -> open now and promotion
 * 
 * @param searchTag - state array used to search tags passed to DropdownTagBar component
 * 
 * @param setSearchTag - state function used to set search tags passed to DropdownTagBar component
 * 
 * @param itemSearch - state used to items to search passed to AddItemCard component
 * 
 * @param setItemSearch - state function used to set items to search AddItemCard component
 * 
 */


const CriteriaBox2 = ({
	back, confirm,
	itemSearch, setItemSearch,
	rating, setRatingStar,
	searchTags, setSearchTags,
	cancel
	}) => {

	return (
		<div>
		<Header  
			content='Venue Criteria'
			cancel={cancel}
		/>
		<Grid>
			<Grid.Column width={8}>
			<Segment 
				color='blue' 
				className='rounded'
				style={{
					marginTop: '3%', 
					borderRadius: '5rem !important'
				}}>
				<h5>Set Minimum Rating</h5>
				<Rating
					onRate={(event, { rating }) => {
						setRatingStar(rating);
					}}
					maxRating={5}
					rating={rating}
					icon='star'
            	/>
			</Segment>
				<Segment 
					color='blue'
					className='rounded'
				>
					<h5>Add search tags</h5>
					<DropdownTagBar 
						searchTag={searchTags}
						setSearchTag={setSearchTags}
					/>
				</Segment>
			</Grid.Column>
			<Grid.Column width={8}>
				<div style={{marginTop: '3%'}}>
					<AddMenuCard  
						itemSearch={itemSearch}
						setItemSearch={setItemSearch}
					/>
				</div>
				
			</Grid.Column>
		</Grid>  
			<Stack direction="row" style={{textAlign: 'right', marginTop: '2%'}} spacing={2}>
			<Button variant="contained" startIcon={<ArrowBack />} onClick={e => back(e)}
			style={{
				borderRadius: 15,
				backgroundColor: "#FFC328",
				color: 'black'
			}}
			>
				Back
			</Button>
			<Button variant="contained" startIcon={<ArrowForward />} onClick={() => confirm()}
				style={{
					borderRadius: 15,
					backgroundColor: "#377f89",
					color: 'white'
				}}
			>
				Generate
			</Button>
		</Stack>
	</div>        
	);
};

export default CriteriaBox2;


CriteriaBox2.propTypes = {
	back: PropTypes.func,
	confirm: PropTypes.func,
    itemSearch: PropTypes.array,
    setItemSearch: PropTypes.func,
	rating: PropTypes.number,
	setRatingStar: PropTypes.func,
	searchTags: PropTypes.array,
	setSearchTag: PropTypes.func,
	confrim: PropTypes.func,
	cancel: PropTypes.func,
}
