import React, { useState } from 'react';
import { 
    Dimmer, 
    Menu, 
    Loader, 
    Button, 
} from 'semantic-ui-react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { DetailedVenueInfo } from '../../gql/venueInfo/venueInfo.gql';
import { GetMyTags } from "../../gql/venueInfo/getMyTags.gql";
import GetAllTags from "../../gql/venueInfo/getAllTags.gql";
import { GetSelf } from '../../gql/self/getSelf.gql';
import { AddRating } from '../../gql/venueInfo/addRating.gql';
import { AddTag } from '../../gql/venueInfo/addTag.gql';
import { RemoveTag } from '../../gql/venueInfo/removeTag.gql';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Banner from './Banner';
import 'semantic-ui-less/semantic.less';
import '../../styles/panes.css';
import MenuSection from './MenuSection';
import Item from './Item';
import AlertBar from '../../shared-components/AlertBar';
import Box from '@mui/material/Box';


/**
 * Creates a menu pane for a venue
 * dictated by the id pulled from the
 * URI parameter
 *  
 */
const MenuPane = () => {

    // grab the id from router
    const { venueID } = useParams();
    const history = useHistory();

    const [selectedTags, setSelectedTags] = useState([]);
    const [canSelect, setCanSelect] = useState(true);

    // setup alert bar state
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");


    let authenticated = true;
    const { loading: selfLoading, error: selfErrors } = useQuery(GetSelf);
	const {
        loading: loadingVenue, 
        error: errorsVenue, 
        data: dataVenue,
        refetch: refetchVenueInfo
    } = useQuery(DetailedVenueInfo, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
		variables: { 
			venueID 
		},
	});
    const allTagsResults = useQuery(GetAllTags);
    const getMyTags = useQuery(GetMyTags, {
        variables: {
            venueID
        },
        onCompleted: (data) => {
            setSelectedTags(data.getMyTags.map(datum => datum.tag._id));
        },
        fetchPolicy: "network-only"
    });
    const [ addRating ] = useMutation(AddRating, {
        onCompleted: (data) => {
            refetchVenueInfo();
            setAlertMessage("Rating added!");
            setSeverity("success");
            setShow(true);
        }
    });  
      
    const [ addTag ] = useMutation(AddTag, {
        onCompleted: (data) => {
            setCanSelect(true);
            // notify user that tag was added
            setAlertMessage('Tag added!');
            setSeverity('success');
            setShow(true);
        }
    });
    const [ removeTag ] = useMutation(RemoveTag, {
        onCompleted: (data) => {
            setCanSelect(true);
            // notify user that tag was removed
            setAlertMessage('Tag removed!');
            setSeverity('info');
            setShow(true);
        }
    });


    const backToMap = () => {
        history.push('/');
    };

    const selectTag = (tagID) => {
        if (!canSelect) return;

        setCanSelect(false);
        if (selectedTags.includes(tagID)) {
            setSelectedTags(selectedTags.filter(tag => tag !== tagID));
            removeTag({
                variables: {
                    venueID,
                    tagID
                }
            });
        } else {
            setSelectedTags([...selectedTags, tagID]);
            addTag({
                variables: {
                    venueID,
                    tagID
                }
            });
        }
    };

	if (loadingVenue || selfLoading) {
		return (
			<Dimmer active>
				<Loader />
			</Dimmer>
		)
	}
    
    if (selfErrors) 
        authenticated = false;

	if (errorsVenue) {
		console.log("[**] Menu pane", errorsVenue);
        return (
            <div className='home-primary-pane menu-pane'>  
                <h1 align="center">
                    Menu Unavailable
                </h1>
            </div>
        )
	}

	let propData;
    let specials = [];
    let food = [];
    let drinks = [];
    // pre-process data
	if (dataVenue && dataVenue.getVenueInfoByID.venueInformation !== null) {
		propData = dataVenue;
        console.log("[>>] Menu pane data", propData);

        dataVenue.getVenueInfoByID.venueInformation.menu.map(menuItem => {
            if (menuItem.special !== 'FALSE') 
                specials.push(menuItem);
            else
                switch (menuItem.itemKind.category) {
                    case 'FOOD':
                        food.push(menuItem);
                        break;
                    case 'DRINK':
                        drinks.push(menuItem);
                        break;
                    default:
                        food.push(menuItem);
                }
        });
	}  else {
        // router tries to cache or sth
        window.location = '/';
    }
    
    let tags = [];
    if (allTagsResults.loading || allTagsResults.error) {
        tags = [];
    } else {
        tags = allTagsResults.data.getAllTags;
    }
    

    return (
        <div className='home-primary-pane menu-pane'>  
            <div className="ui secondary menu">
                <Menu.Menu 
                    position='left' 
                    style={{ 
                        marginTop: '10px', 
                    }}
                >
                    <Menu.Item >
                        <Button 
                            icon='map' 
                            circular 
                            content='Back To Map'
                            onClick={backToMap}
                        /> 
                    </Menu.Item>
                </Menu.Menu>
            </div>
            <Banner
                venueID={venueID} 
                name={propData.getVenueInfoByID.venueInformation.name}
                rating={propData.getVenueInfoByID.venueInformation.averageRating}
                promotion={propData.getVenueInfoByID.venueInformation.promotion}
                openingHours={propData.getVenueInfoByID.venueInformation.openingHours}
                tags={tags}
                selectedTags={selectedTags}
                selectTag={selectTag}
                canSelect={canSelect}
                credits={propData.getVenueInfoByID.venueInformation.uploadValue}
                authenticated={authenticated}
                addRating={addRating}
            />
 
            <Scrollbars
                autoHide
                style={{ height: 220, float: 'left' }}

            >
                { specials.length > 0 && <MenuSection type='Specials'/> }
                { specials.length > 0 &&
                    <Box 
                        sx={{
                            ml: '10%'
                        }}
                    >
                        {
                            specials.map((menuItem, index) => (   
                                <Item 
                                    key={index}
                                    name={menuItem.name}
                                    price={menuItem.price}
                                    type={menuItem.itemKind.type}
                                    special={menuItem.special}
                                    verified={menuItem.verified}
                                    specialHours={menuItem.specialHours.hours}
                                    specialExpiry={menuItem.specialExpiry}
                                />
                            ))
                        }               
                    </Box>
                }
                { food.length > 0 && <MenuSection type='Food' /> }
                { food.length > 0 &&
                    <Box 
                        sx={{
                            ml: '10%'
                        }}
                    >
                        {
                            food.map((menuItem, index) => (
                                <Item 
                                    key={index}
                                    name={menuItem.name}
                                    price={menuItem.price}
                                    type={menuItem.itemKind.type}
                                    verified={menuItem.verified}
                                    promotion={menuItem.promotion}
                                    special={false}
                                />
                            ))
                        }   
                    </Box>
                }
                { drinks.length > 0 && <MenuSection type='Drinks'/> }
                { drinks.length > 0 &&
                    <Box 
                        sx={{
                            ml: '10%'
                        }}
                    >
                        {
                            drinks.map((menuItem, index) => (
                                <Item 
                                    key={index}
                                    name={menuItem.name}
                                    price={menuItem.price}
                                    type={menuItem.itemKind.type}
                                    verified={menuItem.verified}
                                    promotion={menuItem.promotion}
                                    special={false}
                                />
                            ))
                        }
                    </Box>
                }

                <AlertBar 
                    message={alertMessage}
                    severity={severity}
                    show={show}
                    setShow={setShow}
                />
            
            </Scrollbars>
        </div>
    )
};


export default MenuPane;