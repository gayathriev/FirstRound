import { useCallback } from 'react'
import { 
	Grid, 
	Rating, 
	Radio, 
	Segment, 
	Checkbox,
} from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import { Alert } from '@mui/material';
import VenueTypeDropdown from './VenueTypeDropdown';
import PropTypes from 'prop-types'
import Slider from '@mui/material/Slider';
import AddMenuCard from './AddMenuCard';
import DropdownTagBar from './DropdownTagBar';
import { createTheme, ThemeProvider } from '@mui/material/styles/';
import './index.css'

const muiTheme = createTheme({
	overrides: {
		MuiSlider: {
		  track: { backgroundColor: 'red' },
		  thumb: { backgroundColor: 'red' },
		},
	}
});  


/**
 * 
 * @returns a extensive searchbox with many criterias.
 *  
 * 
 * @param venueType - state array used to for to search tags
 * 
 * @param setVenueType - state function used to set search tags
 * 
 * @param ratingStar - minimum rating value for search
 * 
 * @param setRatingStar - set minimum rating value for search
 * 
 * @param venueCondition - set venue condition -> open now and promotion
 * 
 * @param setVenueCondition - set venue condition for search func
 * 
 * @param searchTag - state array used to search tags passed to DropdownTagBar component
 * 
 * @param setSearchTag - state function used to set search tags passed to DropdownTagBar component
 * 
 * @param setLocation - only called if my location is selected
 * 
 * @param setRadiusCallback - using radius call back to set radius
 * 
 * @param setSelectingLocation - boolean value to set whether location is being selected from map
 * 
 * @param radius - current radius value to render on slider
 * 
 * @param locationType - changes between 'current' or 'map' to set location
 * 
 * @param setLocationType -  set location type function
 * 
 * @param itemSearch - state used to items to search passed to AddItemCard component
 * 
 * @param setItemSearch - state function used to set items to search AddItemCard component
 * 
 */


const AdvancedSearchBar = ({
	venueType, setVenueType, 
	itemSearch, setItemSearch,
	ratingStar, setRatingStar,
	venueCondition, setVenueCondition,
	searchTags, setSearchTags,
	setLocation, setRadiusCallback,
	setSelectingLocation, radius,
	locationType, setLocationType
	}) => {
	
	const onRadiusChange = useCallback(value => {
		setRadiusCallback(value)
    },[]);

	function handleLocationChange(event, {value}) {
		setLocationType(value);

		if (value === 'current') {

			navigator.geolocation.getCurrentPosition(
				successCallback,
				console.error,
				{ maximumAge: 600_000 }
			  );
			  
			  function successCallback(position) {
				// By using the 'maximumAge' member above, the position
				// object is guaranteed to be at most 10 minutes old.
				let radFloat = parseFloat(radius * 1000);
				setLocation({
					searchCenter: {
						longitude: position.coords.longitude,
						latitude: position.coords.latitude,
					},
					radius: radFloat,
				});
				setSelectingLocation(false);
			}
			  
		}
		if (value === 'map') {
			setSelectingLocation(true);
		}
	}

	return (
	<Segment className='searchBox'
		style={{ 
			borderRadius: '10px !important'
		}}
	>
		<div
			style={{marginTop: '2%'}}
		>
			<Grid>
				<Grid.Column width={8}>
					<Grid>
						<h5>Set search radius</h5>
						<Grid.Column width={15}>
						<ThemeProvider theme={muiTheme}>
							<Slider 						
								size="small"
								aria-label="Small"
								valueLabelDisplay="auto"
								value={radius}
								min={1}
								max={20}
								onChange={e => onRadiusChange(e.target.value)}
								style={{marginLeft: '2%'}}
							/>
						 </ThemeProvider>
						</Grid.Column>
					</Grid>
				</Grid.Column>
				<Grid.Column width={4} textAlign='center'>
					<Checkbox 
						label='Open now' 
						checked={venueCondition.openNow}
						onChange={(event, { checked }) => {
							setVenueCondition({
								openNow: true,
								promotion: venueCondition.promotion,
							});
						}}
					/>
				</Grid.Column>
				<Grid.Column width={4} textAlign='center'>
					<Checkbox 
						label='Promotion running' 
						checked={venueCondition.promotion}
						onChange={(event, { checked }) => {
							setVenueCondition({
								openNow: venueCondition.openNow,
								promotion: true,
							});
						}}
					/>
				</Grid.Column>
			</Grid>
		</div>
		<Grid>
			<Grid.Column width={8}>
			<Segment 
				basic={false} 
				color='blue' 
				className='locationClass rounded'
				>
				<Grid>
					<Grid.Column width={6}>
						<Radio
							label='Use current location'
							name='radioGroup'
							value='current'
							checked={locationType === 'current'}
							onChange={handleLocationChange}
						/>
					</Grid.Column>
					<Grid.Column width={8}>
						<Radio
							label='Choose location on map'
							name='radioGroup'
							value='map'
							checked={locationType === 'map'}
							onChange={handleLocationChange}
						/>
					</Grid.Column>
				</Grid>	
				{locationType === 'map'? (
                    <Alert severity="info">Double click on desired map location!</Alert>
                ) : (null)}
			</Segment>
			<Segment 
				color='blue' 
				className='rounded venueClass'
			>
				<h5>Set venue type</h5>
				<VenueTypeDropdown 
					venueType={venueType}
					setVenueType={setVenueType}
				/>
				<h5>Set minimum rating</h5>
				<Rating
					onRate={(event, { rating }) => {
						setRatingStar(rating);
					}}
					rating={ratingStar}
					maxRating={5}
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
				<AddMenuCard  
					itemSearch={itemSearch}
					setItemSearch={setItemSearch}
				/>
			</Grid.Column>
		</Grid>          
	</Segment> 
	);
};

export default AdvancedSearchBar;


AdvancedSearchBar.propTypes = {
	venueType: PropTypes.string,
	setVenueType: PropTypes.func,
    itemSearch: PropTypes.array,
    setItemSearch: PropTypes.func,
	ratingStar: PropTypes.number,
	setRatingStar: PropTypes.func,
	venueCondition: PropTypes.object,
	setVenueCondition: PropTypes.func,
	searchTags: PropTypes.array,
	setSearchTag: PropTypes.func,
	setLocation: PropTypes.func,
	radius: PropTypes.number,
	setRadiusCallback: PropTypes.func,
	setSelectingLocation: PropTypes.func,
	locationType: PropTypes.string,
	setLocationType: PropTypes.func,
}
