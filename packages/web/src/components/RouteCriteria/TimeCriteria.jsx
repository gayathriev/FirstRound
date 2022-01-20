import { useState } from 'react'
import { 
	Segment, 
} from 'semantic-ui-react';

import 'semantic-ui-less/semantic.less';
import PropTypes from 'prop-types'
import '../AdvancedSearchBar/index.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Header from './Header';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DateAdapter from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { addHours } from 'date-fns/esm';
import { Alert } from '@mui/material';
import { differenceInMinutes } from 'date-fns';

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
 * @param routeVenue - state array that holds all selected venues
 * 
 */

const TimeCriteria = ({
    next, back, cancel,
    maxHourTime, setMaxHourTime, 
    venueCount, setVenueCount,
    timeAtVenue, setStartTime,
    setTimeAtVenue, routeVenues,
    venueReq
    }) => {
	
    const [dateVal, setDateVal] = useState(new Date());
    const [venueMinError, setVenueMinError] = useState(false);
    const [venueMaxError, setVenueMaxError] = useState(false)
    const [dateError, setDateError] = useState(false);
    const [pastError, setPastError] = useState(false); 

    /**
     * @todo Have a date, time check for each venues
     * passed in venues is @routeVenue prop
     * Add function here!
     */
     const venueOpenAtTime = (venue, time) => {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const currentDay = days[time.getDay()];

        for (let hours of venue.openingHours.hours) {
            if (hours.day !== currentDay) continue;

            if (hours.open.hours > time.getHours() ||
                (hours.open.hours === time.getHours() && hours.open.minutes > time.getMinutes())) 
                continue;

            if (hours.close.hours < time.getHours() ||
                (hours.close.hours === time.getHours() && hours.close.minutes < time.getMinutes()))
                continue;
        
            return true;
        }

        return false;
    }

    const verifyRequiredRoutesOpen = (newDate) => {
        // loop through all the required venues and ensure
        // that they are open at some point during the date range
        
        if (venueReq) {
            for (let venue of routeVenues) {
                let open = false;
    
                for (let hourInc = 0; hourInc <= maxHourTime; hourInc++) {
                    let dateToCheck = addHours(newDate, hourInc);
    
                    if (venueOpenAtTime(venue, dateToCheck)) {
                        open = true;
                        break;
                    }
                }
    
                // if this venue is never open during the date range
                // return false
                if (!open) {
                    return false;
                }
            }
        }
        // return true if all venues are open
        return true;
    }

    const handleChange = (newValue) => {
        setDateVal(newValue)
        setStartTime(newValue);
	};

    const nextStep = (event) => {
        
        let flag = false;
        if (venueCount.min > venueCount.max){
            setVenueMaxError(true);
            flag = true;
        }
        else {
            setVenueMaxError(false);
            
        }
        if (venueCount.min <= 0){
            setVenueMinError(true);
            flag = true;
        }
        else {
            setVenueMinError(false);
        }

        if (venueReq) {
            if (venueCount.min < routeVenues.length ) {
                setVenueMinError(true);
                flag = true;
            }
        }

        if (!verifyRequiredRoutesOpen(dateVal)) { 
            setDateError(true);
            flag = true;
        }
        else {
            setDateError(false);
        }

        if ((Date.now() > dateVal) && (differenceInMinutes(Date.now(), dateVal) > 30)) {
            setPastError(true);
            flag = true;
        } else {
            setPastError(false);
        }
        
        if (flag === false) {
            next(event);
        }
        // next(event);
    }
    
	return (
		<div> 
            <Header  
                content='Route Time'
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
                    <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DateTimePicker
                            label="Tour date"
                            disablePast
                            value={dateVal}
                            onChange={handleChange}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                            error={dateError || pastError}
                            helperText={dateError ? 'Time has passed for venues!' : 'Start date and time for tour'}
                        />
                    </LocalizationProvider>
                    <TextField 
                        type="number" 
                        inputprops={{ inputprops: { min: 1, max: 12} }} 
                        id="outlined-basic" 
                        label="Max tour time" 
                        variant="outlined"
                        value={maxHourTime}
                        helperText='Max tour time'
                        onChange={event => setMaxHourTime(event.target.value)}
                    />

                    {venueReq ? (
                        <TextField 
                            inputprops={{ inputprops: { min: 1, max: 100} }}
                            type="number"
                            error={venueMinError}
                            id="outlined-basic" 
                            label="Min. venues" 
                            variant="outlined" 
                            helperText={venueMinError? 'Should be more than selected!' : 'Min Venues'}
                            value={venueCount.min}
                            onChange={event => setVenueCount({
                                min: event.target.value,
                                max: venueCount.max,
                            }
                        )}
                    />
                    ): (
                        <TextField 
                            inputprops={{ inputprops: { min: 1, max: 100} }}
                            type="number"
                            error={venueMinError}
                            id="outlined-basic" 
                            label="Min. venues" 
                            variant="outlined" 
                            helperText={venueMinError? 'Should be more than 0' : 'Min venues'}
                            value={venueCount.min}
                            onChange={event => setVenueCount({
                                min: event.target.value,
                                max: venueCount.max,
                                }
                            )}
                            
                        />
                    )
                
                    }
                        <TextField 
                            type="number" 
                            error={venueMaxError}
                            inputprops={{ inputprops: { min: 0, max: 100} }} 
                            id="outlined-basic" 
                            label="Max. venues" 
                            variant="outlined"
                            value={venueCount.max}
                            onChange={event => setVenueCount({
                                min: venueCount.min,
                                max: event.target.value,
                                }
                            )}
                            helperText={venueMaxError? 'Should be more than Min!' : 'Maximum venues'}
                        />
                        <TextField 
                            type="number"
                            inputprops={{ inputprops: { min: 0, max: 300} }} 
                            id="outlined-basic" 
                            variant="outlined"
                            label="Average time"
                            value={timeAtVenue}
                            onChange={event => setTimeAtVenue(event.target.value)}
                            helperText='Average time spent at a venue'
                        />
                    
                </Stack>
                {dateError? (
                    <Alert severity="error">
                        At least one saved venue is not open during this time range. Change date, or remove venues from
                        route plan.
                    </Alert>
                ): (null)}
                {pastError? (
                    <Alert severity="error">
                        The selected time and date may not be in past.
                    </Alert>
                ): (null)}
                
            </Segment>
            <Stack direction="row" postion='right' style={{textAlign: 'right', marginTop: '2%'}} spacing={2}>
                <Button variant="contained" startIcon={<ArrowBack />} onClick={e => back(e)}
                style={{
                    borderRadius: 15,
                    backgroundColor: "#FFC328",
                    color: 'black'
                }}
                >
                    Back
                </Button>
                <Button variant="contained" startIcon={<ArrowForward />} onClick={e => nextStep(e)}
                    style={{
                        borderRadius: 15,
                        backgroundColor: "#377f89",
                        color: 'white'
                    }}
                >
                    Next
                </Button>
		    </Stack>
		</div>  
    );
};

export default TimeCriteria;


TimeCriteria.propTypes = {
    next: PropTypes.func,
	back: PropTypes.func,
    cancel: PropTypes.func,
    maxHourTime: PropTypes.number,
    setMaxHourTime: PropTypes.func,
    venueCount: PropTypes.object,
    setVenueCount: PropTypes.func,
    timeAtVenue: PropTypes.number,
    setStartTime: PropTypes.func,
    setTimeAtVenue: PropTypes.func,
    routeVenues: PropTypes.array,
    venueReq: PropTypes.bool,
}