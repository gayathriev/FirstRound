import React from 'react';
import { Icon } from 'semantic-ui-react';
import { bool, func, number, string } from 'prop-types';
import { Marker } from 'react-map-gl';

const BarIcon = (isPromotion, onRoute) => {
    if (isPromotion) {
        return (
            <Icon circular inverted color='yellow' name='beer' />
        );
    }
    if (onRoute) {
        return (
            <Icon circular inverted color='purple' name='beer' />
        );
    }
    return (
        <Icon circular inverted color='teal' name='beer' />
    );

};

const CafeIcon = (isPromotion, onRoute) => {
    if (isPromotion) {
        return (
            <Icon circular inverted color='yellow' name='coffee' />
        );
    }
    if (onRoute) {
        return (
            <Icon circular inverted color='purple' name='coffee' />
        );
    }
    return (
        <Icon circular inverted color='teal' name='coffee' />
    );

};
    

const RestaurantIcon = (isPromotion, onRoute) => {
    if (isPromotion) {
        return (
            <Icon circular inverted color='yellow' name='utensils' />
        );
    }
    if (onRoute) {
        return (
            <Icon circular inverted color='purple' name='utensils' />
        );
    }
    return (
        <Icon circular inverted color='teal' name='utensils' />
    );

};

/**
 *
 * @returns A venue marker to display on the map
 * accordind to conditions different colour's and 
 * Icons will be displayed indication different type of venues
 * 
 * @param venueType - venue type to display icon
 * 
 * @param longitude - logitude of marker
 * 
 * @param latitude - latitude of marker
 * 
 * @param venueName - venues name
 * 
 * @param venueID - venue ID 
 * 
 * @param setSelectedVenue - state to show popUp
 * 
 * @param setLat - populates popUp coordinates
 * 
 * @param setLong - populates popUp coordinates
 * 
 * @param setID - populates popUp id
 * 
 * @param isPromotion - bool to change venues color
 * 
 * @param onRoute - bool to change venues color
 * 
 */


const VenueMarker = (props) => {
    const { 
        venueType, 
        longitude, 
        latitude, 
        venueName, 
        venueID, 
        setSelectedVenue, 
        setLat, 
        setLong, 
        setId, 
        isPromotion,
        onRoute,
    } = props;

    let icon;
    switch (venueType) {
        case "BAR": 
            icon = BarIcon(isPromotion, onRoute);
            break;
        case "CAFE":
            icon = CafeIcon(isPromotion, onRoute);
            break;
        default: 
            icon = RestaurantIcon(isPromotion, onRoute);
            break;
    }

    function showPopUp() {
        setLat(latitude);
        setLong(longitude);
        // fire show venue card too
        setSelectedVenue(venueName, venueID);
        setId(venueID);
    }

    return (
        <Marker longitude={longitude} latitude={latitude} onClick={showPopUp}>
            {icon}
        </Marker>
    );
};

VenueMarker.defaultProps = {
    venueType: "",
    longitude: 0,
    latitude: 0,
    venueName: "",
    venueID: "",
    isPromotion: false,
    onRoute: false,
}

VenueMarker.propTypes = {
    venueType: string,
    longitude: number,
    latitude: number,
    venueName: string,
    venueID: string,
    setSelectedVenue: func,
    setLong: func,
    setLat: func,
    setId: func,
    isPromotion: bool,
    onRoute: bool,
}

export default VenueMarker;