import React, { createRef, useState } from 'react';
import { Segment } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import VenueCard from './VenueCard';
import TopMenu from './TopMenu';
import FilterDropdown from './FilterDropdown';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import 'semantic-ui-less/semantic.less';
import './index.css';

// route plans
import { useLazyQuery } from '@apollo/client';
import { UPDATE_ROUTE } from '../../gql/routes/updateRoute.gql';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FinaliseModal from './FinaliseModal';
import ShareModal from './ShareModal';
import RoutePlanner from './RoutePlanner';

/**
 * 
 * @param authenticated - whether the user
 * is signed into the platform
 * 
 * @param existingRoute - is the user viewing
 * a existing saved route
 * 
 * @param setActivePanel -  
 * 
 * @returns sidebar for the
 * homepage with a list of venues
 * and a top menu in a scrollable segment
 */
export const HomeSidebar = ({
    authenticated,
    existingRoute,
    setActivePanel,
    activePanel,
    routePlanner,
    venueArray, 
    setVenueArray,
    searchResultVenues,
    featuredVenues,
    routeVenues,
    setRouteVenues,
    sortDistance, 
    sortPrice, 
    sortReviews,
    updateRouteGeo,
    setShowAlert,
    setAlertSeverity,
    setAlertMessage,
    routeData,
}) => {

    // route plan finalise button handlers
    const [finalising, setFinalising] = useState(false);
    const [finaliseModal, setFinaliseModal] = useState(false);
    const [shareRoute, setShareRoute] = useState(false);
    const [routeID, setRouteID] = useState('');
    const [routeName, setRouteName ] = useState('');

    // edit route query
    const [updateRoute, { loading: updateRouteLoading }] = useLazyQuery(UPDATE_ROUTE, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            console.log('[>>] updateRoute', data.editRoute);
            updateRouteGeo(null);
            if (!data.errors)
                updateRouteGeo(
                    data.editRoute
                );
            else {
                console.log("[>>] edit route failed", data.errors);
                setAlertMessage('Try again!');
                setAlertSeverity('error');
                setShowAlert(true);
            }
        }
    });

    // handle finalise 
    const handleFinalise = () => {
        setFinalising(true);
        // start save and share flow
        setFinaliseModal(true);
    }

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newCardOrder = Array.from(venueArray.resArray);
        const [removed] = newCardOrder.splice(result.source.index, 1);
        newCardOrder.splice(result.destination.index, 0, removed);
        setVenueArray({ resArray: newCardOrder });
        updateRouteGeo(
            {
                content: {
                    routeGeometry: "",
                    venuesInRoute: []
                }
            }
        );
        // update the map view
        updateRoute({
            variables: {
                venueIDs: newCardOrder.map(venue => venue._id)
            }
        });

        console.log("[>>] post drag", newCardOrder);
    }

    // add venue to route plan
    const handleAdd = (index) => {
        let updatedVenues;
        // add venue to route planner from
        // current list of venues (featured || search)
        if (activePanel === 'featured') {
            updatedVenues = [...routeVenues, featuredVenues[index]];
        }
        else if (activePanel === 'searchResults') {
            updatedVenues = [...routeVenues, searchResultVenues[index]];
        }

        setRouteVenues(updatedVenues);

        // show add alert bar
        setShowAlert(false); // deal with rapid add
        setAlertMessage('Venue Added!');
        setAlertSeverity('success');
        setShowAlert(true);

        // call update route with routeVenues
        updateRoute({
            variables: {
                venueIDs: updatedVenues.map(venue => venue._id)
            }
        });

    }

    // remove route items
    const handleRemove = (index) => {
        updateRouteGeo(null);
        updateRouteGeo(
            {
                content: {
                    routeGeometry: "",
                    venuesInRoute: []
                }
            }
        );
        const updatedVenues = routeVenues.filter((_, i) => i !== index);
        // update venues list too
        setVenueArray({ resArray: updatedVenues });
        setRouteVenues(updatedVenues);
        
        // show remove alert bar
        setShowAlert(false); // deal with rapid remove
        setAlertMessage('Venue Removed');
        setAlertSeverity('info');
        setShowAlert(true);

        // call update route with routeVenues
        updateRoute({
            variables: {
                venueIDs: updatedVenues.map(venue => venue._id)
            }
        });
    }


    // clear route plan helper
    const clearRoutePlan = () => {
        setVenueArray({ resArray: [] });
        setRouteVenues([]);
        updateRouteGeo(
            {
                content: {
                    routeGeometry: "",
                    venuesInRoute: []
                }
            }
        );
    }
      

    return (
        <Box 
            sx={{ 
                pt: 0, 
                ml: 1, 
                mr: 1.5,
                minWidth: 265
            }}
        >
            <TopMenu 
                setActivePanel={setActivePanel} 
                activePanel={activePanel}
            />
    
            <Scrollbars
                autoHide
                style={{ height: 660, marginTop: '6px' }}
            >
                { activePanel === 'searchResults' &&
                    venueArray.resArray.length > 0 ?  (
                        <FilterDropdown 
                            sortDistance={sortDistance}
                            sortPrice={sortPrice}
                            sortReviews={sortReviews}
                        />
                    ) : null
                }

                <Segment basic >
                    {(routePlanner && !existingRoute) ? (
                        <RoutePlanner 
                            venues={venueArray.resArray}
                            onDragEnd={onDragEnd}
                            authenticated={authenticated}
                            existingRoute={existingRoute}
                            handleAdd={handleAdd}
                            handleRemove={handleRemove}
                        />
                        ) : (
                            venueArray.resArray.length > 0 &&
                            venueArray.resArray.map((venue, index) => (
                                <Box key={index}>
                                    <VenueCard
                                        index={index}
                                        removeHandler={handleRemove}
                                        addHandler={handleAdd}
                                        venue={venue}
                                        authenticated={authenticated}
                                        existing={existingRoute}
                                    />
                                </Box>
                            ))  
                        )
                    }
                </Segment>
            </Scrollbars>
            { (activePanel === 'routePlan' && !existingRoute) &&
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {authenticated ?
                        <LoadingButton
                            disabled={routeVenues.length < 1}
                            onClick={handleFinalise} 
                            loading={finalising}
                            loadingPosition="end"
                            variant="contained" 
                            endIcon={<SendIcon />}
                        >
                            Finalise
                        </LoadingButton>

                        : 
                        
                        <Tooltip title="Login to save routes" arrow>
                            <LoadingButton
                                sx={{ bgcolor: 'text.disabled'}}
                                loadingPosition="end"
                                variant="contained" 
                                endIcon={<SendIcon />}
                            >
                                Finalise
                            </LoadingButton> 
                        </Tooltip>
                    }
                    <FinaliseModal 
                        show={finaliseModal}
                        setShow={setFinaliseModal}
                        setFinalising={setFinalising}
                        setRouteID={setRouteID}
                        setShareRoute={setShareRoute}
                        routeVenues={routeVenues}
                        routeName={routeName}
                        setRouteName={setRouteName}
                        routeData={routeData}
                        clearRoutePlan={clearRoutePlan}
                    />

                    <ShareModal 
                        openTrigger={shareRoute}
                        stateHandler={setShareRoute}
                        shareID={routeID}
                        title="Share Route"
                        type="route"
                        shareName={routeName}
                    />
                </Box>
            }
        </Box>
    )
}

HomeSidebar.propTypes = {
	venueArray: PropTypes.object,
    FilterDropdown: PropTypes.object,
    sortDistance: PropTypes.func,
    sortReviews: PropTypes.func,
    sortPrice: PropTypes.func,
}

export default HomeSidebar;