import React, { useState, useEffect } from 'react';
import { 
    Grid,
    Button
} from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client';
import GET_ALL_VENUES_MAP from '../components/MapView/getAllVenuesMap.gql';
import SEARCH_VENUES_MAP from '../components/MapView/venueSearchMaps.gql';
import MapView from '../components/MapView/MapView';
import PrimaryButton from '../shared-components/primary-button/PrimaryButton';
import { HomeSidebar } from '../components/HomeSidebar/HomeSidebar';
import { NavBar } from '../components/NavBar/NavBar';
import { SummaryVenueInfo, GET_FEATURED_VENUES } from '../gql/venueInfo/venueInfo.gql';
import AdvancedSearchBar from '../components/AdvancedSearchBar/AdvancedSearchBar';
import { useParams } from 'react-router';
import MenuPane from '../components/Menu/MenuPane';
import haversine from 'haversine-distance';
import MultiCrit from '../components/RouteCriteria/MultiCrit';
import { GenerateRoute } from '../gql/routes/generateRoute.gql'
import { GetRouteByID } from '../gql/routes/getRouteById.gql'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AlertBar from '../shared-components/AlertBar';

import '../styles/panes.css';

// handle mobile || small screens
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * Mounts the home page and its subsidiary
 * components, critically:
 * 
 * + The sidebar
 * + The map view pane
 * + The nav bar
 * + Search & advanced search
 * + venue info pane
 * + Route criteria
 * 
 * Navigation to the page is handled by the
 * Router component which also supplies params
 * as props that are used to handel viewing 
 * shared routes, venues and venue menus.
 * 
 */


// Custom break points for responsiveness
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 768,
      lg: 1200,
      xl: 1536,
    },
  },
});



const Home = () => {

    // authentication handler
    const [authenticated, setAuthenticated] = useState(false);

    // pull venue id or routeID from uri if
    // present
    const { venueID, routeID } = useParams();
    const [venueData, setVenueData] = useState({
        venueArray: [],
    });

    // setup alert bar state
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");

    const [panelData, setPanelData] = useState({
        resArray: [],
    });

    // Toggle for showing advance search and route crit
    const [showAdv, setShowAdv] = useState(false);
    const [showCrit, setShowCrit] = useState(false);
    
    /**
     * Handel small screens
    */
    // const theme = useTheme(customBps);
    // breakpoint handler
    const desktopRes = useMediaQuery(theme.breakpoints.up('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Used for updating the venues to be displayed on the map
    const updateDisplayData = (venues) => {
        setVenueData({
            venueArray: venues,
        });
    }

    /**
    * <-- Side bar state handlers -->
    */

    const updateSideBar = (venues) => {
        const wrappedArray = [venues].flat();
        setPanelData({
            resArray: wrappedArray,
        });
    }
    
    const [ activePanel, setCurrentPanel ] = useState('featured');
    const [ featuredVenues, setFeaturedVenues ] = useState([]);
    const [ searchResultVenues, setSearchResultVenues ] = useState([]);
    const [ routeVenues, setRouteVenues ] = useState([]);
    const [ routePlanner, setRoutePlanner ] = useState(false);

    // get featured venues 
    const { data: featuredVenuesData , loading: loadingFeatured} = useQuery(
        GET_FEATURED_VENUES, {
            onCompleted: (data) => {
                setFeaturedVenues(data.getFeaturedVenues);
                // initially set the panel data to featured venues
                updateSideBar(data.getFeaturedVenues);
            }
        }
    );

    // set panel activity
    const setActivePanel = (panel) => {
        setCurrentPanel(panel);
        setRoutePlanner(false);

        switch (panel) {
            case 'featured':
                updateSideBar(featuredVenues);
                break;
            case 'searchResults':
                updateSideBar(searchResultVenues);
                break;
            case 'routePlan':
                setRoutePlanner(true);
                updateSideBar(routeVenues);
                break;
            default:
                break;
        }
    }    


    // Our basic search criteria
    const [venueType, setVenueType] = useState('');

    // The following all states are for adv search
    const [venueName, setVenueName] = useState('');
    const [ratingStar, setRatingStar] = useState(0);
    const [venueCondition, setVenueCondition] = useState({
        openNow: false, 
        promotion: false,
    });
    const [itemSearch, setItemSearch] = useState([]); 
    const [searchTags, setSearchTags] = useState([]);
    const [searchRadius, setSearchRadius] = useState(5);
    const [locationType, setLocationType] = useState('');

    const [showRouteData, setShowRouteData] = useState(null);


    // Search center coordinates
    const [location, setLocation] = useState({
        searchCenter: {
            longitude: '',
            latitude: '',
        },
        radius: 5000
    });

    // The following stuff is used to control whether or not
    // we're getting information from the map about location for search
    const [selectingLocation, setSelectingLocation] = useState(false);


    /** -------------------> Route States <---------------- */
    // Similar to advance searches, these are states managing
    // Route criteria searches.
    const [routeRating, setRouteRating] = useState(0);
    const [routeItemSearch, setRouteItemSearch] = useState([]); 
    const [routeTags, setRouteTags] = useState([]);
    const [routeRadius, setRouteRadius] = useState(5);

    const [startTime, setStartTime] = useState('');
    const [maxHourTime, setMaxHourTime] = useState(5);
    const [venueCount, setVenueCount] = useState({
        min: 0,
        max: 0,
    })

    const [timeAtVenue, setTimeAtVenue] = useState(20);
    const [genRouteData, setGenRouteData] = useState(null);
    const [routeLocationType, setRouteLocationType] = useState('');
    const [calcCenter, setCalcCenter] = useState({
        longitude: '',
        latitude: '',
    });

    // const [showCalCenter, setShowCalCenter] = useState(false);
    const [selectVenuesFlag, setSelectVenuesFlag] = useState(false);
    const [routelocation, setRouteLocation] = useState({
        routeCenter: {
            longitude: '',
            latitude: '',
        },
    });

    // The following stuff is used to control whether or not
    // we're getting information from the map about location for routes
    const [selRouteLocation, setSelRouteLocation] = useState(false);


    // When we launch a search we have to 'parse' the input
    // we're given a little (if the user adds and then deletes
    // a venue name, for example, we probably don't want to search
    // for an empty string (even though the results should be fine))
    // It's also a good chance to strip punctuation, etc. from names
    const parseInput = () => {
        setShowAdv(false);

        let results = {};
        if (venueType !== '') {
            results.venueType = venueType;
        }

        if (venueName !== '') {
            results.basicSearch = venueName;
        }

        if (itemSearch.length !== 0) {
            results.menuItems = itemSearch.map(item => {
                return {...item, 'itemKind':item.itemKind.id};
            });
            console.log(itemSearch);
        }

        if (searchTags.length !== 0) {
            results.venueTags = searchTags;
        }

        if (venueCondition.openNow) {
            results.openNow =  new Date();
        }

        if (venueCondition.promotion) {
            results.promotionNow =  new Date();
        }

        if (ratingStar !== 0) {
            let r = parseFloat(ratingStar);
            results.minRating = r;
        }
        
        if (location.searchCenter.longitude !== '' &&
            location.searchCenter.latitude !== '' &&
            location.radius !== '') {
            
            results.location = {
                searchCenter: [
                    location.searchCenter.longitude,
                    location.searchCenter.latitude,
                ],
                radius: parseFloat(searchRadius*1000),
            }
        }
        
        return {
            searchCriteria : results,
            now : new Date()
        };
    };

    function confirmGenRoute() {
        parseRoute();
        setShowCrit(false);
    }


    // When we launch a search we have to 'parse' the input
    // Similar to advance search. This is to parse Route info
    // Basic validation is done here
    // Call generate route mutation.
    const parseRoute = () => {
        setShowAdv(false);

        setSelRouteLocation(false);
        setGenRouteData(null);

        setGenRouteData(
            {
                content: {
                    routeGeometry: "",
                    venuesInRoute: []
                }
            }
        );

        let results = {};
    
        if (startTime !== '') {
            results.startTime = startTime;
        } else {
            results.startTime = new Date();
        }

        if (maxHourTime !== '') {
            results.maxTourTime = parseInt(maxHourTime);
        }

        if (routelocation.routeCenter.longitude !== '' &&
            routelocation.routeCenter.latitude !== '') {
            console.log(routelocation);
            results.searchCenter = [
                parseFloat(routelocation.routeCenter.longitude), 
                parseFloat(routelocation.routeCenter.latitude)
            ]
        }
        else {

            console.log(routeVenues);
            results.requiredVenues = routeVenues.map(venue => venue._id);
        }

        if (routeRadius !== '') {
            results.radius = parseInt(routeRadius*1000);
        }

        if (venueCount.min !== 0) {
            results.minVenues = parseInt(venueCount.min);
        }

        if (venueCount.max !== 0) {
            results.maxVenues = parseInt(venueCount.max);
        }

        if (timeAtVenue !== 0) {
            results.timeAtVenue = parseInt(timeAtVenue);
        }

        let venueCriteria = [];
        

        if (routeTags.length !== 0) {
            for (let i = 0; i < routeTags.length; i++) { 
                venueCriteria.push({"venueTag" : routeTags[i]})
            }
        }

        if (routeItemSearch.length !== 0) {
            for (let item of routeItemSearch) {
                venueCriteria.push(
                    {
                        menuItem : {
                            ...item,
                            itemKind : item.itemKind.id
                        }
                    }
                );
            }
        }

        if (routeRating !== 0) {
            let r = parseFloat(routeRating);
            venueCriteria.minRating = r;
        }
        
        results.venueCriteria = venueCriteria;

        generateRoute({
            variables: {
                routeInput: results,
            }
        })
        clearRoute();
    };

    function clearRoute() {
        setRouteItemSearch([]);
		setRouteRating(0);
		setRouteTags([]);
		setTimeAtVenue(20);
		setVenueCount({
			min: 0,
			max: 0,
		})
		setMaxHourTime(0);
		setSelRouteLocation(false);
		setRouteRadius(5);
		setShowCrit(false);
		setRouteLocationType('');
        setStartTime('');
		setSelectVenuesFlag(false);
        setRouteLocation({
            routeCenter: {
                longitude: '',
                latitude: '',
            },
        })
    }
    
    // We need to use the fetch policy network-only
    // because onCompleted isn't called when the data is cached
    // for some reason, this is a bad solution but I'll revisit
    // if we start having performance issues
    const [defaultQuery, defaultResults] = useLazyQuery(
        GET_ALL_VENUES_MAP,
        {
            onCompleted: () => {
                updateDisplayData(defaultResults.data.getAllVenues);
            },
            fetchPolicy: 'network-only',
        }
    );

    const [routeIDQuery, routeIDResults] = useLazyQuery(

        GetRouteByID,
        {
            variables: {
                routeID: routeID
            },
            onCompleted: (data) => {
                console.log(data);
                setRouteVenues(data.getRouteByID.content.venuesInRoute);
                updateSideBar(data.getRouteByID.content.venuesInRoute);
                setCurrentPanel('routePlan');
                setRoutePlanner(true);
            },
            fetchPolicy: 'network-only',
        }
    );


    const [searchQuery, searchResults] = useLazyQuery(
        SEARCH_VENUES_MAP,
        {
            onCompleted: (data) => {
                if (!data.searchVenues.content) {
                    // show alert and clear search results
                    setAlertMessage(data.searchVenues.errors[0]);
                    setSeverity("error");
                    setShow(true);
                    updateDisplayData([]);
                    if (activePanel === 'searchResults')
                        updateSideBar([]);
                    setSearchResultVenues([]);

                } else {
                    updateDisplayData(data.searchVenues.content);
                    updateSideBar(data.searchVenues.content);
                    setSearchResultVenues(data.searchVenues.content);
                    setCurrentPanel('searchResults');
                    if (!desktopRes)
                        handleDrawerToggle();
                }
            },
            fetchPolicy: 'network-only',
        }
    );


    // popUp query results passed to map
    const [popUpQuery, popUpResults] = useLazyQuery(
        SummaryVenueInfo,
        {
            onCompleted: () => {
                if (!popUpResults.data.getVenueInfoByID) {
                    // set alert bar message and display
                    setAlertMessage(popUpResults.data.getVenueInfoByID.errors[0]);
                    setSeverity("error");
                    setShow(true);
                } else {               
                    updateSideBar(popUpResults.data.getVenueInfoByID.venueInformation);
                    setSearchResultVenues([popUpResults.data.getVenueInfoByID.venueInformation]);
                    setCurrentPanel('searchResults');
                    if (!desktopRes) 
                        handleDrawerToggle();
                }
            },
            fetchPolicy: 'network-only',
        }
    );

    function clearSearch() {
        setLocation({
            searchCenter: {
                longitude: '',
                latitude: '',
            },
            radius: 5000,
        });
        setVenueType('');
        setVenueName('');
        setVenueCondition({
            openNow: false, 
            promotion: false,
        })
        setRatingStar(0);
        setSelectingLocation(false);
        setItemSearch([]);
        setSearchTags([]);
        defaultQuery(
            {
                variables : {
                    now: new Date()
                }
            }
        );
        setSearchRadius(5)
        // preserve featured
        if (activePanel === 'searchResults')
            updateSideBar([]);

        setSearchResultVenues([]);
        setLocationType('');

        setAlertMessage('Search Cleared');
        setSeverity('info');
        setShow(true);
    }


    const  displayPopupInfo = (venueID) => {
        popUpQuery({
            variables: { venueID }
        });
    }

    const [ generateRoute ] = useMutation(GenerateRoute, {
        onCompleted: (data) => {
            console.log('[>>] generate Route', data);

            if (data.generateRoute.content !== null) {
                setGenRouteData(null);
                setGenRouteData({
                    content: {
                        routeGeometry: "",
                        venuesInRoute: []
                    }
                })
                setRouteVenues([]);
                setGenRouteData(data.generateRoute);
                setRouteVenues(data.generateRoute.content.venuesInRoute);
                updateSideBar(data.generateRoute.content.venuesInRoute);
                setCurrentPanel('routePlan');
                setRoutePlanner(true);
            }
            if (data.generateRoute.errors !== null) {
                setAlertMessage(data.generateRoute.errors[0]);
                setSeverity("error");
                setShow(true);
            }

            if (data.errors) {
                setAlertMessage('Route generation failed, try again');
                setSeverity("error");
                setShow(true);
            }

            setSelectVenuesFlag(false);
        }
    })


    // run the default query when the component loads
    useEffect (() => {
        defaultQuery(
            {
                variables : {
                    now: new Date()
                }
            }
        );
        if (routeID) {
            routeIDQuery({
                variables : routeID
            })
            console.log(routeIDResults);
        }
    }, []);

    function sortPrice() {
        let sortedRes = [].concat(panelData.resArray);
        sortedRes.sort((a, b) => {
            let costA = a.averagePrice;
            let costB = b.averagePrice;
            return costA - costB;
        });
        console.log(sortedRes);
        setPanelData({
            resArray: sortedRes,
        });
    }

    const toggleDrawer = (newOpen) => () => {
        setShowAdv(newOpen);
      };

    function sortReviews() {
        let sortedRes = [].concat(panelData.resArray);
        sortedRes.sort((a, b) => {
            let costA = a.averageRating;
            let costB = b.averageRating;
            return costB - costA;
        });
        setPanelData({
            resArray: sortedRes,
        });
    }


    const distance = (coor1, coor2) => {
        const a = { latitude: coor2.latitude, longitude: coor2.longitude }
        const b = { latitude: coor1[1], longitude: coor1[0] }
        return(haversine(a, b))
    };	

    function sortDistance() {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if (position) {
                    let sortedRes = [].concat(panelData.resArray);
                    // let sortedRes = venueResults
                    sortedRes.sort((a, b) => {
                        let disA = distance(a.location.coordinates, position.coords);
                        let disB = distance(b.location.coordinates, position.coords);
                        return disA - disB;
                    });
                    setPanelData({
                        resArray: sortedRes,
                    });
                }
            },
            console.log,
            { maximumAge: 700_000 }
        );
    }

    const matches = useMediaQuery('(min-width:800px)');
    if (loadingFeatured) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingFeatured}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )        
    }

    const sidebarProps = {
        authenticated: authenticated,
        setActivePanel: setActivePanel,
        activePanel: activePanel,
        routePlanner: routePlanner,
        venueArray: panelData,
        setVenueArray: setPanelData,
        searchResultVenues: searchResultVenues,
        featuredVenues: featuredVenues,
        routeVenues: routeVenues,
        setRouteVenues: setRouteVenues,
        sortDistance: sortDistance,
        sortPrice: sortPrice,
        sortReviews: sortReviews,
        setShowAlert: setShow,
        setAlertSeverity: setSeverity,
        setAlertMessage: setAlertMessage,
        updateRouteGeo: setGenRouteData,
        routeData: genRouteData,
        existingRoute: routeID,
    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar setAuthenticated={setAuthenticated} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'right'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Box>

            <Box sx={{ maxWidth: 2100 }} >
                <Grid>
                    <Grid.Column computer={10} mobile={16} tablet={10}>
                        <div className='main-section'>
                            <Grid>
                                <Grid.Column width={16}>
                                    <div width='80%' style={{borderRadius: '10px'}}>
                                        <div className="ui right action left icon input fluid"> 
                                            <input 
                                                style={{ borderRadius: '20px'}}
                                                type="text" 
                                                placeholder="Search..." 
                                                onChange={event => setVenueName(event.target.value)}
                                                value={venueName} 
                                            />
                                            <i className="search icon"></i>
                                            {showAdv ? (
                                                <button 
                                                    title="Basic Search"
                                                    className="ui basic icon button" 
                                                    onClick={() => {
                                                        setShowAdv(false);
                                                        
                                                    }}
                                                >
                                                    <i aria-hidden="true" className="angle up icon" />
                                                        {/* Basic Search */}
                                                </button>

                                            ): (
                                                <button 
                                                    title="Adavnced Search"
                                                    className="ui basic icon button" 
                                                    onClick={() => {
                                                        setShowAdv(true);
                                                        setShowCrit(false);
                                                    }}
                                                >
                                                        <i aria-hidden="true" className="angle down icon" />
                                                    {/* Advanced Search */}
                                                </button>

                                            )}
                
                                            <button 
                                                style={{ borderRadius: '0px 20px 20px 0px' }}
                                                className="ui basic icon button" 
                                                onClick={() => {clearSearch()}}
                                            >
                                                <i className="cancel icon" />
                                            </button>
                                            {matches ? (
                                                    <button 
                                                        className="ui circular button secondary" 
                                                        style={{borderRadius: '10em', marginLeft: '0.5%'}} 
                                                        onClick={() => {
                                                            searchQuery({
                                                                variables: parseInput()
                                                            });
                                                        }}
                                                    >
                                                        Search 
                                                    </button>        
                                            ): (   
                                                <Button 
                                                    circular 
                                                    icon='search' 
                                                    color='secondary' 
                                                    onClick={() => {
                                                        searchQuery({
                                                            variables: parseInput()
                                                        });
                                                    }}
                                                    style={{borderRadius: '10em', marginLeft: '0.5%'}}
                                                />

                                            )}
                                            {matches ? (
                                                <div style={{marginLeft: '1%'}}>
                                                    <PrimaryButton 
                                                        content={"Generate Route"}
                                                        onClick={() => {
                                                            setShowCrit(true);
                                                            setShowAdv(false);

                                                        }}
                                                    />
                                                </div>
                                            ): (
                                                <Button 
                                                    circular 
                                                    icon='map pin' 
                                                    color='primary' 
                                                    style={{borderRadius: '10em', marginLeft: '0.5%'}}
                                                    onClick={() => {
                                                        setShowCrit(true);
                                                        setShowAdv(false);
                                                    }}
                                                />
                                            )}            
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid>
                            {showAdv && matches ? (
                                
                                <AdvancedSearchBar 
                                    venueType={venueType}
                                    setVenueType={setVenueType}
                                    itemSearch={itemSearch}
                                    setItemSearch={setItemSearch}
                                    setRatingStar={setRatingStar}
                                    setVenueCondition={setVenueCondition}
                                    searchTags={searchTags}
                                    setSearchTags={setSearchTags}
                                    setLocation={setLocation}
                                    setRadiusCallback={(res) => {
                                        setSearchRadius(res);
                                    }}
                                    setSelectingLocation={(value) => {
                                        setSelectingLocation(value);
                                    }}
                                    ratingStar={ratingStar}
                                    venueCondition={venueCondition}
                                    radius={searchRadius}
                                    locationType={locationType}
                                    setLocationType={setLocationType}

                                />
                            ): (null)}
                            {showAdv && matches === false ? (
                                <Drawer
                                anchor="bottom"
                                open={showAdv}
                                onClose={toggleDrawer(false)}
                              >
                                  <AdvancedSearchBar 
                                        venueType={venueType}
                                        setVenueType={setVenueType}
                                        itemSearch={itemSearch}
                                        setItemSearch={setItemSearch}
                                        setRatingStar={setRatingStar}
                                        setVenueCondition={setVenueCondition}
                                        searchTags={searchTags}
                                        setSearchTags={setSearchTags}
                                        setLocation={setLocation}
                                        setRadiusCallback={(res) => {
                                            setSearchRadius(res);
                                        }}
                                        setSelectingLocation={(value) => {
                                            setSelectingLocation(value);
                                        }}
                                        ratingStar={ratingStar}
                                        venueCondition={venueCondition}
                                        radius={searchRadius}
                                        locationType={locationType}
                                        setLocationType={setLocationType}
                                    />
                              </Drawer>
                            ): (null)}
                            {showCrit ? (
            
                                <MultiCrit
                                    itemSearch={routeItemSearch}
                                    setItemSearch={setRouteItemSearch}
                                    rating={routeRating}
                                    setRatingStar={setRouteRating}
                                    searchTags={routeTags}
                                    setSearchTags={setRouteTags}
                                    location={routelocation}
                                    setRadiusCallback={(res) => {
                                        setRouteRadius(res);
                                    }}
                                    setSelRouteLocation={(value) => {
                                        setSelRouteLocation(value);
                                    }}
                                    radius={routeRadius}
                                    maxHourTime={maxHourTime}
                                    venueCount={venueCount}
                                    setVenueCount={setVenueCount}
                                    setMaxHourTime={setMaxHourTime}
                                    confirm={confirmGenRoute}
                                    setStartTime={setStartTime}
                                    setTimeAtVenue={setTimeAtVenue}
                                    setShowCrit={setShowCrit}
                                    routeVenues={routeVenues}
                                    timeAtVenue={timeAtVenue}
                                    routeLocationType={routeLocationType}
                                    setRouteLocationType={setRouteLocationType}
                                    setCalcCenter={setCalcCenter}
                                    venueReq={selectVenuesFlag}
					                setVenueReq={setSelectVenuesFlag}
                                    setRouteLocation={setRouteLocation}
                                /> 
                            ): (null)}

                        </div>
                        {venueID ? (
                            <MenuPane />
                        ) : ( routeID ? 
                                (
                                    <MapView 
                                        data={venueData} 
                                        selecting={selectingLocation}
                                        selectLocationCallback={(res) => {
                                            setLocation({
                                                searchCenter: {
                                                    longitude: res[0],
                                                    latitude: res[1],
                                                },
                                                radius: location.radius,
                                            })
                                        }}
                                        popUpFunc={displayPopupInfo}
                                        routeData={
                                            (routeIDResults.data !== undefined && routeIDResults.data !== null) ?
                                            routeIDResults.data.getRouteByID : null
                                        }
                                        routeRadius={routeRadius}
                                        selectingRoute={selRouteLocation}
                                        setRouteLocationCallback={(res) =>{
                                            setRouteLocation({
                                                routeCenter: {
                                                    longitude: res[0],
                                                    latitude: res[1],
                                                }
                                            })
                                        }}
                                        routePlanner={routePlanner}
                                        calcCenter={calcCenter}
                                        showCalCenter={selectVenuesFlag}
                                    />
                                )                   
                            : (
                                <MapView 
                                    data={venueData} 
                                    selecting={selectingLocation}
                                    selectLocationCallback={(res) => {
                                        setLocation({
                                            searchCenter: {
                                                longitude: res[0],
                                                latitude: res[1],
                                            },
                                            radius: location.radius,
                                        })
                                    }}
                                    popUpFunc={displayPopupInfo}
                                    routeData={genRouteData}
                                    routeRadius={routeRadius}
                                    selectingRoute={selRouteLocation}
                                    setRouteLocationCallback={(res) =>{
                                        setRouteLocation({
                                            routeCenter: {
                                                longitude: res[0],
                                                latitude: res[1],
                                            }
                                        })
                                    }}
                                    routePlanner={routePlanner}
                                    calcCenter={calcCenter}
                                    showCalCenter={selectVenuesFlag}
                                />
                            )
                        )}
                    </Grid.Column>
                    <Grid.Column computer={6} mobile={0}>
                        <Drawer
                            variant="temporary"
                            anchor="right"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                // Better open performance on mobile.
                                keepMounted: true, 
                            }}
                            sx={{
                                width: 400,
                                flexShrink: 0,
                                display: { xs: 'block', sm: 'block', md: 'none' },
                            }}
                        >
                            <Box sx={{ mt: 15 }}>
                                { mobileOpen && 
                                    <HomeSidebar {...sidebarProps} />
                                }
                            </Box>
                        </Drawer>

                        <Box
                            sx={{
                                mr: 5,
                                maxWidth: 500,
                                display: { xs: 'none', sm: 'none', md: 'block' },
                            }}
                        >   
                            <HomeSidebar {...sidebarProps} />
                        </Box>
                    </Grid.Column>
                </Grid>
            </Box>

            <AlertBar 
                show={show}
                setShow={setShow}
                message={alertMessage}
                severity={severity}
            />

        </ThemeProvider>
    );
}

export default Home;