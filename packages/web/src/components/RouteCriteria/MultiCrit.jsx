import { useState } from 'react'
import { 
	Segment, 
} from 'semantic-ui-react';
// import { Slider } from 'react-semantic-ui-range';


import 'semantic-ui-less/semantic.less';
import PropTypes from 'prop-types'
import '../AdvancedSearchBar/index.css'
import LocationCriteria from './LocationCriteria';
import TimeCriteria from './TimeCriteria';
import CriteriaBox2 from './CriteriaBox2';

/**
 * 
 * @returns a multi step form With 3 main components.
 * 
 * Spliting functionalities to Time/Location/CriteraBox2
 *  
 * 
 * @param back - back function used to go to previous form state
 * 
 * @param next - function used to go to next form state
 * 
 * @param cancel - clear function used passed to Header
 * 
 * @param maxHourTime - maxHourTime set to show how long tour lasts
 * 
 * @param setMaxHourTime - set maxHourTime function
 * 
 * @param venuesCount - set venue count -> min and max
 * 
 * @param setVenuesCount - set venue count -> min and max
 * 
 * @param timeAtVenue - state for how long you'd spend at a venue
 * 
 * @param setTimeAtVenue - state function used to set timeAtVenue
 * 
 * @param setStartTime - state function used to set startTime
 * 
 * @param venueReq - state used check if selected venues is used
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


const MultiCrit = ({ 
	itemSearch, setItemSearch,
	rating, setRatingStar,
	searchTags, setSearchTags,
	location, setRadiusCallback,
	setStartTime,
	setSelRouteLocation,
	maxHourTime, setMaxHourTime, 
    venueCount, setVenueCount,
	timeAtVenue, confirm, 
	setTimeAtVenue, setShowCrit,
	routeVenues, radius,
	routeLocationType, setRouteLocationType,
	setCalcCenter,
	venueReq, setVenueReq, setRouteLocation
	}) => {
	
    const [step, setStep] = useState(1);

    const continues = (e) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const back = (e) => {
        e.preventDefault();
        setStep(step - 1);
    };

	const cancel = (e) => {
		// clear all variables
		setItemSearch([]);
		setRatingStar(0);
		setSearchTags([]);
		setTimeAtVenue(20);
		setVenueCount({
			min: 0,
			max: 0,
		})
		setMaxHourTime(0);
		setSelRouteLocation(false);
		setStep(1);
		setRadiusCallback(5);
		setShowCrit(false);
		setRouteLocationType('');
		setVenueReq(false);
		setRouteLocation({
            routeCenter: {
                longitude: '',
                latitude: '',
            },
        })

	}
	
	return (
		<Segment className='searchBox'
			basic={false}
			style={{ 
				borderRadius: '10px !important'
			}}
		>
			
            {step === 1? (
				<LocationCriteria 
					next={continues}
					back={back}
					cancel={cancel}
					setSelRouteLocation={setSelRouteLocation}
					setRadiusCallback={setRadiusCallback}
					setVenueReq={setVenueReq}
					routeVenues={routeVenues}
					radius={radius}
					location={location}
					routeLocationType={routeLocationType}
					setRouteLocationType={setRouteLocationType}
					setCalcCenter={setCalcCenter}
				/>
                ) : (null)}

            {step === 2? (
				<TimeCriteria
					next={continues}
					back={back}
					cancel={cancel}
					maxHourTime={maxHourTime}
					venueCount={venueCount}
					setVenueCount={setVenueCount}
					setMaxHourTime={setMaxHourTime}
					timeAtVenue={timeAtVenue}
					setStartTime={setStartTime}
					setTimeAtVenue={setTimeAtVenue}
					venueReq={venueReq}
					routeVenues={routeVenues}
				/>
                ) : (null)}
			
			{step === 3? (
				<CriteriaBox2
					confirm={confirm}
					cancel={cancel}
					back={back}
					rating={rating}
					itemSearch={itemSearch}
					setItemSearch={setItemSearch}
					setRatingStar={setRatingStar}
					searchTags={searchTags}
					setSearchTags={setSearchTags}
				/>
                ) : (null)}         
	</Segment> 
	);
};

export default MultiCrit;


MultiCrit.propTypes = {
    itemSearch: PropTypes.array,
    setItemSearch: PropTypes.func,
	rating: PropTypes.number,
	setRatingStar: PropTypes.func,
	radius: PropTypes.number,
	searchTags: PropTypes.array,
	setSearchTag: PropTypes.func,
	location: PropTypes.object,
	setRadiusCallback: PropTypes.func,
	setSelRouteLocation: PropTypes.func,
	maxHourTime: PropTypes.number,
    setMaxHourTime: PropTypes.func,
    venueCount: PropTypes.object,
    setVenueCount: PropTypes.func,
	timeAtVenue: PropTypes.number,
	confirm: PropTypes.func,
	setStartTime: PropTypes.func,
	setTimeAtVenue: PropTypes.func,
	setShowCrit: PropTypes.func,
	routeVenues: PropTypes.array,
	routeLocationType: PropTypes.string,
	setRouteLocationType: PropTypes.func,
	venueReq: PropTypes.bool,
	setVenueReq: PropTypes.func,
	setRouteLocation: PropTypes.func,
}