import React from 'react';
import PropTypes from 'prop-types';
import { 
    Icon,
    Header,
    Popup
 } from 'semantic-ui-react';
import 'semantic-ui-less/semantic.less';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import OpeningHours from './OpeningHours';
import Box from '@mui/material/Box';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';
import './index.css';
import { Stack } from '@mui/material';

// week days
const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", 
    "Thursday", "Friday", "Saturday",
];

// determine if the item is on special
// now
const specialOnNow = (specialHours) => {
    const now = new Date();
    const day = days[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const isActive = specialHours.find(specialHour => {
            if (
                specialHour.day === day && 
                specialHour.close.hours >= currentHour &&
                specialHour.open.hours <= currentHour 
            ) {
                // close edge case
                if (
                    specialHour.close.hours === currentHour &&
                    specialHour.close.minutes < currentMinute
                )
                    return;
                
                // open edge case
                if (
                    specialHour.open.hours === currentHour &&
                    specialHour.open.minutes > currentMinute
                )
                    return;
                
                else return specialHour;
            }
        }
    );

    return !!isActive;
}

/**
 * Display a item row including a dynamically chosen 
 * icon based on the type and a icon symbolising whether a 
 * venue is verified and if the item qualifies for a special 
 * and/or a promotion. 
 * @param name - item name 
 * 
 * @param price - item price
 * 
 * @param verified - item is verified by business
 * 
 * @param type - item type from itemKind
 * 
 * @param special - the item is on special
 * 
 * @param specialHours - the hours the special is 
 *                          optionally valid for
 * 
 * @param specialExpiry - the expiry date of the special
 * 
 * @param promotion - the item is on promotion
 * 
 * @param checkBoxPromo - the state handler for the 
 * promotion checkbox
 * 
 * @param checkedItems - list of items that are checked
 * 
 * @param setCheckedItems - the state handler for the
 * checked items list
 * 
 * @param addCheckedItem - the state handler for the
 * checked items list submission
 * 
 * @todo 
 *
 * + cleanup is active function
 */
const Item = ({
    name,
    price,
    verified,
    type,
    special,
    specialHours,
    specialExpiry,
    promotion,
    checkBoxPromo,
    checkBoxID,
    checkedItems,
    setCheckedItems,
    addCheckedItems
}) => {

    let isActive;
    // determine the icon to display
    if (specialHours)
        isActive = specialOnNow(specialHours);

    /** 
     * Construct renderable for popup.
     */
    const specialTimes = (
        <Box >
            {specialHours ?
                <>
                    <Typography 
                        variant="subtitle1"
                        sx={{
                            ml: 1
                        }}
                    >
                        Available
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: 200
                        }}
                    >
                        <OpeningHours openingHours={specialHours} />
                    </Box>
                </>
                : 'Valid any time'
            }
        </Box>
    );

    const expiryTime = (
        <>  
            {specialExpiry ?
                <>
                    <Typography variant="subtitle1">Expires</Typography>
                    <Typography variant="body2">
                        {new Date(specialExpiry.specialEnd).toLocaleDateString()}
                    </Typography>
                </>
                : null
            }      
        </>
    );

    // display different icon based on
    // if special is on now
    const specialHoursIcon = (
        <>
            {specialTimes ?
                <>
                    {isActive ?
                        <Popup
                            position='top center'
                            content={specialTimes}
                            trigger={
                                <Icon name='clock' color='teal' />
                            } 
                        />
                        :
                        <Popup
                            position='top center'
                            content={specialTimes}
                            trigger={
                                <Icon name='clock'/>
                            } 
                        />
                    }
                </>
                : null
            }
        </>
    )

    // determine icon to render for type
    let itemIcon;
    switch(type) {
        case 'Burger':
            itemIcon = <FaIcons.FaHamburger />
            break;
        case 'Beer':
            itemIcon = <Icon name='beer' />
            break;
        case 'Asian':
            itemIcon = <GiIcons.GiNoodles />
            break;
        case 'Noodles':
            itemIcon = <GiIcons.GiFastNoodles />
            break;
        case 'Chips':
            itemIcon = <GiIcons.GiFrenchFries />
            break;
        case 'Entree':
            itemIcon = <GiIcons.GiBerriesBowl />
            break;
        case 'Dumplings':
            itemIcon = <GiIcons.GiDumpling />
            break;
        case 'Juice':
            itemIcon = <GiIcons.GiOrangeSlice />
            break;
        case 'Meal':
            itemIcon = <MdIcons.MdFastfood />
            break;
        case 'Soft Drink':
            itemIcon = <GiIcons.GiSodaCan />
            break;
        case 'Espresso martini':
            itemIcon = <FaIcons.FaGlassMartiniAlt />
            break;
        case 'Cocktail':
            itemIcon = <GiIcons.GiMartini />
            break;
        case 'Wine':
            itemIcon = <GiIcons.GiWineBottle />
            break;
        case 'Mixed Spirits':
            itemIcon = <GiIcons.GiBooze />
            break;
        case 'Shots':
            itemIcon = <GiIcons.GiGlassShot />
            break;
        case 'Coffee':
            itemIcon = <GiIcons.GiCoffeeCup />
            break;
        case 'Wrap':                                
            itemIcon = <GiIcons.GiBread />
            break;
        case 'Pie':
            itemIcon = <GiIcons.GiPieSlice />
            break;
        case 'Dessert':
            itemIcon = <GiIcons.GiCakeSlice />
            break;
        case 'Ice Cream':
            itemIcon = <FaIcons.FaIceCream />
            break;
        case 'Sushi':
            itemIcon = <GiIcons.GiSushis />
            break;
        case 'Healthy':
            itemIcon = <GiIcons.GiFruitBowl />
            break;
        case 'Thai':
            itemIcon = <GiIcons.GiNoodles />
            break;
        case 'Pizza':
            itemIcon = <FaIcons.FaPizzaSlice />
            break;
        case 'Breakfast':
            itemIcon = <GiIcons.GiButterToast />
            break;
        case 'Sweets':
            itemIcon = <GiIcons.GiWrappedSweet />
            break;
        case 'Seafood':
            itemIcon = <GiIcons.GiFriedFish />
            break;
        case 'Sandwich':
            itemIcon = <GiIcons.GiSlicedBread />
            break;
        case 'Stir Fry':
            itemIcon = <GiIcons.GiWok />
            break;
        case 'Mexican':
            itemIcon = <GiIcons.GiTacos />
            break;
        case 'Pasta':
            itemIcon = <GiIcons.GiHotMeal />
            break;
        case 'Share Plate':
            itemIcon = <MdIcons.MdPeople />
            break;
        case 'Main':
            itemIcon = <GiIcons.GiMeal />
            break;
        case 'Hot Drink':
            itemIcon = <GiIcons.GiCoffeeCup />
            break;
        case 'Cold Drink':
            itemIcon = <MdIcons.MdLocalDrink />
            break;
        case 'Tea':
            itemIcon = <GiIcons.GiTeapot />
            break;
        case 'Bubble Tea':
            itemIcon = <GiIcons.GiBoba />
            break;
        case 'Milkshake':
            itemIcon = <MdIcons.MdOutlineCoffeeMaker />
            break;
        case 'Smoothie':
            itemIcon = <MdIcons.MdOutlineCoffeeMaker />
            break;
        case 'Energy Drink':
            itemIcon = <GiIcons.GiBottledBolt />
            break;
        case 'Water':
            itemIcon = <MdIcons.MdOutlineLocalDrink />
            break;
        case 'Milk':
            itemIcon = <GiIcons.GiMilkCarton />
            break;
        default:
            itemIcon = <MdIcons.MdMenuBook />
    }   

    
    return (
        <>
            <Stack
                direction="row"
                alignItems="left"
                justifyContent="space-between"
                marginBottom={2} 
            >
                <Box>
                    <Typography variant='h6'>
                        { checkBoxPromo && (
                                <Checkbox 
                                    onChange={(event, { checked }) => {
                                        addCheckedItems(event.target.checked, checkBoxID);
                                    }}
                                />
                            )
                        }
                        <>
                            { itemIcon }
                            { verified && <Icon name='check' size='tiny' corner='bottom right'/> } 
                        </>
                        <> { name } </>
                    </Typography>
                </Box>
                <Box
                    sx={{
                        mr: '10%'
                    }}
                >
                    <Typography variant='h6'>
                        { promotion && 
                            <Popup
                                position="top center"
                                content="Qualifies for Promotion"
                                trigger={
                                    <Icon name='gift' />
                                }
                            />
                        }
                        { special && 
                            specialHoursIcon
                        }
                        { specialExpiry &&
                            <Popup
                                position='top center'
                                content={expiryTime}
                                trigger={
                                    <Icon name='hourglass end'/>
                                }
                            />
                        }

                        { price }
                    
                    </Typography>
                </Box>
            </Stack>
            {/* <br /> */}
        </>
    )
};


Item.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    verified: PropTypes.bool,
    type: PropTypes.string,
    special: PropTypes.string,
    specialHours: PropTypes.object,
    promotion: PropTypes.bool,
    checkBoxPromo: PropTypes.bool,
    checkBoxID: PropTypes.string,
    checkedItems: PropTypes.array,
    setCheckedItems: PropTypes.func,
    addCheckedItems: PropTypes.func
}

export default Item;