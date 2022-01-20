import React, { 
    useMemo, 
    useState, 
    useCallback } 
from 'react';
import { 
    shape, 
    PropTypes 
} from 'prop-types';
import ReactMapGL, { 
    Popup, 
    Marker, 
    Source, 
    Layer, 
    GeolocateControl 
} from 'react-map-gl';
import Circle from '@turf/circle'
import { toGeoJSON } from '@mapbox/polyline';
import { Icon } from 'semantic-ui-react';
import MapLegend from './MapLegend';
import VenueMarker from './VenueMarker';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../styles/panes.css';


/**
 * @returns MapView to show
 * all venues, routes, radius overlay
 * 
 * @param {*} props 
 * 
 * Conditionally renders with props states.
 * Dependingon state, routes/venues or 
 * radius overlay is displayed.
 * 
 * User can double click to select location on
 * certain situations which are handled by 
 * the props
 */
const MapView = (props) =>{

    const [viewport, setViewport] = useState({
        width: 'fit',
        height: '100%',
        latitude: -33.9159104,
        longitude:  151.2278473,
        zoom: 15
        // renderTextureMode: true
    });

    const [vID, setId] = useState(null);
    const [selLong, setLong] = useState();
    const [selLat, setLat] = useState();
    const [clicked, setClicked] = useState();
    const [routeClick, setRouteClick] = useState(false);


    const [marker, setMarker] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [routeMarker, setRouteMarker] = useState({
        latitude: '',
        longitude: '',
    });

    const [events, logEvents] = useState({});
    
    const onMarkerDragStart = useCallback(event => {
    logEvents(_events => ({..._events, onDragStart: event.lngLat}));
    }, []);
    
    const onMarkerDrag = useCallback(event => {
    logEvents(_events => ({..._events, onDrag: event.lngLat}));
    }, []);
    
    const onMarkerDragEnd = useCallback(event => {
        logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
        props.selectLocationCallback(event.lngLat);
        setMarker({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
        });
        // SET LOCATION RADIUS!!
    }, []);

    
    const { data } = props;
    const { popUpFunc } = props;
      
    const [selectedVenue, setSelectedVenue] = useState(null);
    const handleVenueSelect = (selection, venueID) => {
        setSelectedVenue(selection);
        popUpFunc(venueID);
    };

    const circleStyle = {
        id: 'point',
        type: 'fill',
        paint: {
            'fill-color': '#5a3fc0',
            'fill-opacity': 0.3,
        }
    };

    const lineStyle = {
        'type': 'line',
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#4D4861',
        'line-width': 5
        }
    }

    let center = [routeMarker.longitude,  routeMarker.latitude];
    let radius = props.routeRadius;
    let options = {steps: 64, units: 'kilometers', properties: {foo: 'bar'}};
    let circle = Circle(center, radius, options);

    let center2 = [props.calcCenter.longitude,  props.calcCenter.latitude];
    let circle2 = Circle(center2, radius, options);

    // Only update markers when our data changes
    const markers = useMemo(() => (data.venueArray.map(
        venue => (
            <VenueMarker
                key={venue._id}
                venueType={venue.venueType}
                longitude={venue.location.coordinates[0]}
                latitude={venue.location.coordinates[1]} 
                venueName={venue.name}
                venueID={venue._id}
                setSelectedVenue={handleVenueSelect}
                setLat={setLat}
                setLong={setLong}
                setId={setId}
                isPromotion={venue.isPromotion}
            />
        )
    )), [data]);

    const venuePopup = (
            <Popup 
                latitude={selLat} 
                longitude={selLong} 
                style={{backgroundColor: 'white'}}
                onClose={() => setSelectedVenue(null)} 
            >
                <h3>{selectedVenue}</h3>
            </Popup>
    );

    const {width, height, latitude, longitude, zoom} = viewport;
    return (
        <div className='home-primary-pane map-pane'>
            {/* TODO: change to use env */}
            <ReactMapGL
                onDblClick={event => {
                    
                    if (props.selecting) {
                        props.selectLocationCallback(event.lngLat);
                        setMarker({
                            longitude: event.lngLat[0],
                            latitude: event.lngLat[1]
                        })
                        setClicked(true);
                    }
                    if (props.selectingRoute) {
                        props.setRouteLocationCallback(event.lngLat);
                        setRouteMarker({
                            longitude: event.lngLat[0],
                            latitude: event.lngLat[1],
                        })
                        setRouteClick(true);
                    }
                }}

                doubleClickZoom={!props.selecting && !props.selectingRoute}
                width={width}
                height={height}
                latitude={latitude}
                longitude={longitude}
                zoom={zoom}
                mapStyle="https://api.maptiler.com/maps/topographique/style.json?key=peQ2YdnjhT2eYwSigw9X"
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                {props.selecting && clicked? (
                    <div>
                    <Marker
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        offsetTop={-20}
                        offsetLeft={-10}
                        draggable
                        onDragStart={onMarkerDragStart}
                        onDrag={onMarkerDrag}
                        onDragEnd={onMarkerDragEnd}
                        >
                        <Icon inverted color='red' size='big' name='map marker alternate' />
                    </Marker>
                </div>
                ): null}
                {props.selectingRoute && routeClick? (
                    <div>
                    <Marker
                        longitude={routeMarker.longitude}
                        latitude={routeMarker.latitude}
                        offsetTop={-20}
                        offsetLeft={-10}
                        draggable
                        onDragStart={onMarkerDragStart}
                        onDrag={onMarkerDrag}
                        onDragEnd={onMarkerDragEnd}
                        >
                        <Icon inverted color='black' size='big' name='map marker alternate' />
                    </Marker>
                    <Source id="my-data" type="geojson" data={circle}>
                        <Layer {...circleStyle} />
                    </Source>
                </div>
                ): null}
                {markers}
                {props.routeData !== undefined && props.routeData !== null ? (
                    <>
                    <Source type='geojson' data={toGeoJSON(props.routeData.content.routeGeometry)}>
                        <Layer
                            {...lineStyle}
                        />
                                    
                    </Source>
                    {props.routeData.content.venuesInRoute.map((venue, index) => (
                            <div>
                                <VenueMarker
                                    key={venue._id}
                                    venueType={venue.venueType}
                                    longitude={venue.location.coordinates[0]}
                                    latitude={venue.location.coordinates[1]} 
                                    venueName={venue.name}
                                    venueID={venue._id}
                                    setSelectedVenue={handleVenueSelect}
                                    setLat={setLat}
                                    setLong={setLong}
                                    setId={setId}
                                    onRoute={true}
                                />
                            </div>
                        ))
                    }
                    </>
                ) : null} 
                {props.showCalCenter ? (
                    <div>
                        <Marker
                            longitude={props.calcCenter.longitude}
                            latitude={props.calcCenter.latitude}
                            offsetTop={-20}
                            offsetLeft={-10}
                        >
                            <Icon inverted color='black' size='big' name='map marker alternate' />
                        </Marker>
                        <Source id="selected_circle" type="geojson" data={circle2}>
                            <Layer {...circleStyle} />
                        </Source>
                    </div>
                ): null}
                {selectedVenue ? venuePopup : null}
                <MapLegend />
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                    showAccuracyCircle={false}
                />
            </ReactMapGL>
        </div>
    );
}

MapView.defaultProps = {
    data: shape({
        venueArray: [],
    })
}

MapView.propTypes = {
    data: PropTypes.any,
    popUpFunc: PropTypes.func,
    routeData: PropTypes.object,
}


export default MapView;