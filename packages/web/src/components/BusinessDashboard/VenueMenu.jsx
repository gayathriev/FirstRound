import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

// import Banner from '../Menu/Banner';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import OpeningHours from '../Menu/OpeningHours';
import MenuSection from '../Menu/MenuSection';
import Item from '../Menu/Item';
import AddPromoForm from './AddPromotionForm';
import '../Menu/index.css';
import UploadMenuForm from './UploadMenuForm';
import Stack from '@mui/material/Stack';

/**
 * Ideally we want this component 
 * to recycle more components from menu
 * but they are too tightly coupled
 * at the moment.
 * 
 * Consider this a MVP ish
 * 
 */
const VenueMenu = ({
    venue, 
    refetchVenues,
    setAlertMessage,
    setSeverity,
    setShow,
}) => {

    const [openPromo, setOpenPromo] = useState(false);
    const [openForm, setFormOpen ] = useState(false);

    // To remember checkedItems for promotion
    const [checkedItems, setCheckedItems] = React.useState([]);



    let specials = [];
    let food = [];
    let drinks = [];

    function handlePromotionClick() {
        setOpenPromo(true);
    }

    function addCheckedItem (checked, id) {
        if (checked){
            setCheckedItems([...checkedItems, id]);
        }
        else {
            setCheckedItems([...checkedItems.filter(item => item !== id)]);
        }
	}

    if (venue.menu) {
        venue.menu.forEach(menuItem => {
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
    }

    return (
        <Box 
            sx={{
                mb: 3
            }}
        >
            <Typography variant="h5" align='center'>
                {venue.name}
            </Typography>    
            <Divider />
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                }}
            >
                <Box
                    sx={{
                        flexBasis: '400px',
                    }}
                >
                    <OpeningHours 
                        openingHours={venue.openingHours.hours}
                        menuInfo
                    />
                </Box>
                <Box
                    sx={{
                        flexBasis: '180px',
                    }}
                >
                    <Button 
                        variant="outlined"
                        onClick={() => setFormOpen(true) }
                    >
                        Upload Menu
                    </Button>
                </Box>
            </Box>

            <Button 
                variant="contained"  
                onClick={() => {handlePromotionClick()}}
            >
                Start Promotion
            </Button>

            {openPromo ? ( 
                <Box sx={{ ml: -1.2, mt: 1 }}>
                    <AddPromoForm 
                        venueID={venue._id} 
                        setOpen={setOpenPromo} 
                        checkedItems={checkedItems}
                        setShow={setShow}
                        setAlertMessage={setAlertMessage}
                        setSeverity={setSeverity}
                        refetchVenues={refetchVenues} 
                    />
                </Box>
            ): null }
 
            <br />

            <br />
            <UploadMenuForm 
                open={openForm}
                setOpen={setFormOpen}
                venueID={venue._id}
                refetchVenues={refetchVenues} 
            />
            <Box sx={{ mt: 5}} />
            <Scrollbars
                autoHide
                style={{ height: 325, float: 'left'}}

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
                                    verified={menuItem.verified}
                                    special={menuItem.special}
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
                                    checkBoxPromo={openPromo}
                                    checkBoxID={menuItem._id}
                                    checkedItems={checkedItems}
                                    setCheckedItems={setCheckedItems}
                                    addCheckedItems={addCheckedItem}
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
                                    checkBoxPromo={openPromo}
                                    checkBoxID={menuItem._id}
                                    checkedItems={checkedItems}
                                    setCheckedItems={setCheckedItems}
                                    addCheckedItems={addCheckedItem}
                                />
                            ))
                        }
                    </Box>
                }
            </Scrollbars>
        </Box>
    )
};



export default VenueMenu;