import { useState, useCallback } from 'react'
import { 
	Grid,  
	Segment, 
} from 'semantic-ui-react';
import Header from './Header';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import 'semantic-ui-less/semantic.less';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types'
import '../AdvancedSearchBar/index.css'
import { RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Stack from '@mui/material/Stack';
import center from '@turf/center'

/**
 * 
 * @returns a extensive time criteria with validation
 *  
 * 
 * @param back - back function used to go to previous form state
 * 
 * @param next - function used to go to next form state
 * 
 * @param cancel - clear function used passed to Header
 * 
 * @param location - route coordinates, validation to check map is selected
 * 
 * @param radius - radius value for slider
 * 
 * @param setRadiusCallback - set radius callback function
 * 
 * @param setSelRouteLocation - boolean value to see if clicking location on map
 * 
 * @param routeLocationType - state location map or selectVenue
 * 
 * @param setRouteLocationType - state function used to set routeLocationType
 * 
 * @param setCalcCenter - state function to set calculated center for selected venues
 * 
 * @param setVenueReq - set bool so check if selected venues is used
 * 
 * @param routeVenues - state array that holds all selected venues
 * 
 */


const LocationCriteria = ({
	next, 
	location, setRadiusCallback,
	setSelRouteLocation, radius,
	cancel, routeVenues,
	setVenueReq, 
	routeLocationType, setRouteLocationType,
	setCalcCenter
	}) => {

	const [showMap, setShowMap] = useState(routeLocationType === 'map');
	const [showSelected, setShowSelected] = useState(routeLocationType === 'selected venues');
	const [errorOccured, setErrorOccured] = useState(false);
	const [locationError, setLocationError] = useState(false);

	function handleNext(e) {
		
		if (showSelected) {
			if(routeVenues.length === 0) {
				setErrorOccured(true);
			}
			else {
				next(e);
			}
		}
		if (!showSelected) {

			setErrorOccured(false)
			// error check for location
			if (location.routeCenter.longitude === '' && location.routeCenter.longitude === '') {
				setLocationError(true);
			}
			else {
				setLocationError(false);
				next(e);
			}
		}
	}

	
	const onRadiusChange = useCallback(e => {
		setRadiusCallback(e.target.value)
    },[]);

	

	function handleLocationChange(event) {
		setRouteLocationType(event.target.value);

		if (event.target.value === 'selected venues') {
			setShowMap(false);
			setShowSelected(true);
			setSelRouteLocation(false);
			setLocationError(false);
			
			if (routeVenues.length !== 0){
				let centre = center(
					{
						"type" : "FeatureCollection",
						"features" : routeVenues.map(venue => (
						{
							"type" : "Feature",
							"properties" : null,
							"geometry" : {
								"type" : "Point",
								"coordinates" : venue.location.coordinates
							}
						}
						))
					}
				).geometry.coordinates;

				setVenueReq(true);
				setErrorOccured(false);
				setCalcCenter({
					longitude: centre[0],
					latitude: centre[1],
				})
			} else {
				setErrorOccured(true);
				setRouteLocationType('');
				setShowSelected(false);
			}
		}
		if (event.target.value === 'map') {
			setSelRouteLocation(true);
			setShowMap(true);
			setShowSelected(false);
			setVenueReq(false);
			setErrorOccured(false)
		}
	}

	return (
		<div>
		<Header  
			content='Location Criteria'
			cancel={cancel}
		/>
		<Segment 
			basic={false} 
			color='blue'
			style={{
				margin: '3%', 
				paddingLeft: '1%', 
				paddingRight: '1%', 
				borderRadius: '15px',
				}
			}>
			
			<Grid centered columns={2}>
				<RadioGroup row aria-label="locatin" name="row-radio-buttons-group" onChange={e => handleLocationChange(e)}>
				<Grid.Column width={8}>
					<FormControlLabel 
						value="selected venues" 
						control={<Radio checked={routeLocationType === 'selected venues'}/>} 
						label="Use selected venues" 
					/>
				</Grid.Column>
				<Grid.Column width={8} style={{textAlign: 'center'}}>
					<FormControlLabel 
						value="map" 
						control={<Radio checked={routeLocationType === 'map'}/>} 
						label="Choose location on map" 
					/>
				</Grid.Column>
				
				</RadioGroup>
			</Grid>	
				<Segment
					style={{
						marginTop: '5%', 
						paddingLeft: '1%', 
						paddingRight: '1%', 
						borderRadius: '15px'}
					}>
					<Typography 
						id="input-slider" 
						gutterBottom
					>
						Set Radius (km)
					</Typography>
					<Slider 						
						size="small"
						aria-label="Small"
						valueLabelDisplay="auto"
						value={radius}
						min={1}
						max={20}
						onChange={e => onRadiusChange(e)}
					/>
					{showMap ? (
						<Alert severity="info">Double click on desired map location!</Alert>
					 ) : (null)}
					
					{showSelected ? (
						<div>
							<Alert severity="info">Add venues through venue cards!</Alert>
							<Alert severity="info">Ensure radius selected emcompasses all selected venues!</Alert>
							{errorOccured ? (
								<div>
									<Alert severity="error">No venues selected!</Alert>
									<Alert severity="info">To add venues, select from venue cards!</Alert>
								</div>
							) : (null)}
						</div>
					) : null}
					{errorOccured ? (
						<div>
							<Alert severity="error">No venues selected!</Alert>
							<Alert severity="info">To add venues, select from venue cards!</Alert>
						</div>
					) : (null)}
					{locationError ? (
						<Alert severity="error">Please double click on the map before proceeding</Alert>
					): (null)}
				</Segment>
		</Segment>
		<Stack direction="row" postion='right' style={{textAlign: 'right'}} spacing={2}>
			<Button variant="contained" startIcon={<ArrowForward />} onClick={e => handleNext(e)}
				style={{
					borderRadius: 15,
					backgroundColor: "#FFC328",
					color: 'black'}}
			>
				Next
			</Button>
		</Stack>
		</div>  
    );
};

export default LocationCriteria;


LocationCriteria.propTypes = {
    next: PropTypes.func,
	location: PropTypes.object,
	radius: PropTypes.number,
	setRadiusCallback: PropTypes.func,
	setSelRouteLocation: PropTypes.func,
	cancel: PropTypes.func,
	routeVenues: PropTypes.array,
	setVenueReq: PropTypes.func,
	routeLocationType: PropTypes.string,
	setRouteLocationType: PropTypes.func,
	setCalcCenter: PropTypes.func,
}