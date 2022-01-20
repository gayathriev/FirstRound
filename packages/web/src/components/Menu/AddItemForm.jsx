import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Dimmer, Loader } from 'semantic-ui-react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import Slide from '@mui/material/Slide'; 
import Fade from '@mui/material/Fade';
import Collapse from '@mui/material/Collapse';
import Select from '@mui/material/Select';
import DateAdapter from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import SpecialHoursForm from './SpecialHoursForm';
import { MenuItemUpload } from '../../gql/venueInfo/addMenuItem.gql';
import { GetAllItemKinds } from '../../gql/search/getAllItemKinds.gql';
import UploadMenuItem from '../FileUpload/UploadMenuItem';
import { uppy } from '../FileUpload/uppyConfig';


import TimedSpecialForm from './TimedSpecialForm';
import 'semantic-ui-less/semantic.less';
import AlertBar from '../../shared-components/AlertBar';
import { Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



/**
 * 
 * @returns (currently) a modal
 * with a form  to add items
 * to a venues menu. This
 * includes the ability to
 * add specials or promotions? 
 */
const AddItemForm = ({ open, setOpen, venueID, credits }) => {
    //   const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // on upload success / fail
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const [itemName, setItemName ] = useState('');
    const [itemPrice, setItemPrice ] = useState(0.0);
    const [dateValue, setDateValue] = useState([new Date(), new Date()]);
    const [fromTime, setFromTime] = useState(new Date());
    const [toTime, setToTime] = useState(new Date());
    const [ isSpecial, setIsSpecial ] = useState(false);
    const [ isTimedSpecial, setIsTimedSpecial ] = useState(false);
    const [ category, setCategory ] = useState('');
    const [ itemType, setItemType ] = useState('');
    const [ isRecurring, setIsRecurring ] = useState(false);
    const [ disableTypeSelect, setDisableTypeSelect ] = useState(true);

    // form invalidators
    const [itemNameInvalid, setItemNameInvalid] = useState(false);
    const [itemPriceInvalid, setItemPriceInvalid] = useState(false);
    const [categoryInvalid, setCategoryInvalid] = useState(false);
    const [itemTypeInvalid, setItemTypeInvalid] = useState(false); 

    const [ sundayTime, setSundayTime ] = useState({
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const [ mondayTime, setMondayTime ] = useState({ 
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const [ tuesdayTime, setTuesdayTime ] = useState({ 
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const [ wednesdayTime, setWednesdayTime ] = useState({
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const [ thursdayTime, setThursdayTime ] = useState({ 
        set: false,
        from: new Date(),
        to: new Date() 
    });

    const [ fridayTime, setFridayTime ] = useState({
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const [ saturdayTime, setSaturdayTime ] = useState({
        set: false, 
        from: new Date(),
        to: new Date() 
    });

    const constructSpecialHours = () => {
        let specialHours = [];
        if (sundayTime.set) {
            specialHours.push({
                day: 'Sunday',
                open: {
                    hours: sundayTime.from.getHours(),
                    minutes: sundayTime.from.getMinutes()
                },
                close: {
                    hours: sundayTime.to.getHours(),
                    minutes: sundayTime.to.getMinutes()
                }
            });
        }
        if (mondayTime.set) {
            specialHours.push({
                day: 'Monday',
                open: {
                    hours: mondayTime.from.getHours(),
                    minutes: mondayTime.from.getMinutes()
                },
                close: {
                    hours: mondayTime.to.getHours(),
                    minutes: mondayTime.to.getMinutes()
                }
            });
        }
        if (tuesdayTime.set) {
            specialHours.push({
                day: 'Tuesday',
                open: {
                    hours: tuesdayTime.from.getHours(),
                    minutes: tuesdayTime.from.getMinutes()
                },
                close: {
                    hours: tuesdayTime.to.getHours(),
                    minutes: tuesdayTime.to.getMinutes()
                }
            });
        }
        if (wednesdayTime.set) {
            specialHours.push({
                day: 'Wednesday',
                open: {
                    hours: wednesdayTime.from.getHours(),
                    minutes: wednesdayTime.from.getMinutes()
                },
                close: {
                    hours: wednesdayTime.to.getHours(),
                    minutes: wednesdayTime.to.getMinutes()
                }
            });
        }
        if (thursdayTime.set) {
            specialHours.push({
                day: 'Thursday',
                open: {
                    hours: thursdayTime.from.getHours(),
                    minutes: thursdayTime.from.getMinutes()
                },
                close: {
                    hours: thursdayTime.to.getHours(),
                    minutes: thursdayTime.to.getMinutes()
                }
            });
        }
        if (fridayTime.set) {
            specialHours.push({
                day: 'Friday',
                open: {
                    hours: fridayTime.from.getHours(),
                    minutes: fridayTime.from.getMinutes()
                },
                close: {
                    hours: fridayTime.to.getHours(),
                    minutes: fridayTime.to.getMinutes()
                }
            });
        }
        if (saturdayTime.set) {
            specialHours.push({
                day: 'Saturday',
                open: {
                    hours: saturdayTime.from.getHours(),
                    minutes: saturdayTime.from.getMinutes()
                },
                close: {
                    hours: saturdayTime.to.getHours(),
                    minutes: saturdayTime.to.getMinutes()
                }
            });
        }
        return specialHours;
    }


    const handleClose = () => {
        setIsSpecial(false);
        setIsTimedSpecial(false);
        uppy.reset();
        setItemName('');
        setItemPrice(0.0);
        setDateValue([new Date(), new Date()]);
        setFromTime(new Date());
        setToTime(new Date());
        setIsRecurring(false);
        setSundayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setMondayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setTuesdayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setWednesdayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setThursdayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setFridayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        setSaturdayTime({
            set: false, 
            from: new Date(),
            to: new Date() 
        });
        
        // restore valid form states
        setItemNameInvalid(false);
        setItemPriceInvalid(false);
        setCategoryInvalid(false);
        setItemTypeInvalid(false);

        setOpen(false);
    };


    const {loading, error, data} = useQuery(GetAllItemKinds);
    const [ uploadMenuItem, { loading: uploadLoading } ] = useMutation(MenuItemUpload, {
        onCompleted: (res) => {
            if (!res.menuItemUpload) {
                setMessage('Error uploading menu item, please try again');
                setSeverity('error');
                setShow(true);
            } else {
                setMessage('Your upload is being verified!');
                setSeverity('success');
                setShow(true);
                handleClose();
            }
        }
    });

    let foodTypes = [];
    let drinkTypes = [];

    const handleAddItem = () => {
        // construct special expiry
        const specialExpiry = isTimedSpecial ? {
            specialStart: fromTime, 
            specialEnd: toTime
        } : null;
        // construct special hours
        const specialHours = constructSpecialHours(); 


        if (!itemName || !itemPrice || itemPrice <= 0 || !category || !itemType) {
            setMessage('Please fill out all fields correctly');
            setSeverity('error');
            setShow(true);

            // set applicable error fields
            if (!itemName) 
                setItemNameInvalid(true);
            if (!itemPrice) 
                setItemPriceInvalid(true);
            if (!category)
                setCategoryInvalid(true);
            if (!itemType)
                setItemTypeInvalid(true);
            return;
        }
    
        uppy.upload().then(() => {
            uppy.getFiles().forEach(file => {
                uploadMenuItem({ 
                    variables: {
                        menuItemData: {
                            name: itemName,
                            price: itemPrice,
                            isSpecial: isSpecial,
                            itemKind: itemType,
                            specialExpiry: specialExpiry,
                            specialHours: {
                                hours: specialHours
                            }
                        },
                        venueID: venueID,
                        file: file.data
                    } 
                })
            });
        });
    }



    const isSpecialToggle = () => setIsSpecial((isSpecial) => !isSpecial);
    const isTimedSpecialToggle = () => setIsTimedSpecial((isTimedSpecial) => !isTimedSpecial);
    const recurringToggle = () => setIsRecurring((isRecurring) => !isRecurring);

    const handleItemName = (event) => {
        setItemName(event.target.value);
        setItemNameInvalid(false);
    }
    const handleItemPrice = (event) => {
        setItemPrice(Number(event.target.value));
        setItemPriceInvalid(false);
    }
    const handleCategorySelect = (event) => {
        setCategory(event.target.value);
        setDisableTypeSelect(false);
        setCategoryInvalid(false);
    }
    const handleItemTypeSelect = (event) => {
        setItemType(event.target.value);
        setItemTypeInvalid(false);
    }

    const timedSpecialCheckbox = (
        <FormGroup>
            <FormControlLabel 
                control={
                    <Checkbox
                        onChange={isTimedSpecialToggle}
                    />
                } 
                label="Limited Availability"
            />
        </FormGroup>
    )

    if (loading)
        return (
            <Dimmer active>
                <Loader size="large"/>
            </Dimmer>
        )

    if (error) {
        console.log("[**] Add Item Form error: ", error);
        setOpen(false);
        return null;
    }

    if (data) { 
        foodTypes = data.getAllItemKinds.food;
        drinkTypes = data.getAllItemKinds.drink;
    }

    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Dialog 
            open={open} 
            onClose={handleClose}
            TransitionComponent={Transition}
            fullWidth
        >
            {
                uploadLoading ?  
                <Dimmer active>
                    <Loader size="small"/>
                </Dimmer>
                : null 
            }
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add a item's details and snap a photo to earn
                    points!
                </DialogContentText>
                    <br />
                    <Box 
                        noValidate
                        autoComplete="off"
                        component="form"
                    >
                        <FormControl 
                            variant='standard'  
                            sx={{ 
                                '& > :not(style)': { m: 1, width: '100%' }, 
                                '& .MuiTextField-root': { m: 0.5, width: '32ch' },
                                width: '100%' 
                            }}
                        >
                        <div>
                            <TextField 
                                id="outlined-search" 
                                required
                                label="Item name" 
                                type="search" 
                                error={itemNameInvalid}
                                value={itemName}
                                onChange={handleItemName}
                            />
                            <TextField
                                id="outlined-number"
                                label="Price"
                                type="number"
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                                        $
                                                    </InputAdornment>,
                                    inputMode: 'numeric', 
                                    pattern: '[1-9]*'
                                }}
                                error={itemPriceInvalid || itemPrice < 0}
                                onChange={handleItemPrice}

                            />
                        </div>
                        <div>
                            <FormControl 
                                sx={{ 
                                    m: 0.5, 
                                    minWidth: 150, 
                                    width: '32ch' 
                                }}
                                error={categoryInvalid}
                            >
                                <InputLabel htmlFor="grouped-select" required>
                                    Item Category
                                </InputLabel>
                                <Select 
                                    defaultValue={null} 
                                    id="grouped-select" 
                                    label="Grouping"
                                    onChange={handleCategorySelect}
                                    
                                >
                                    <MenuItem value='food'>
                                        Food
                                    </MenuItem>
                                    <MenuItem value='drink'>
                                        Drink
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl 
                                sx={{ 
                                    m: 0.5, 
                                    minWidth: 150, 
                                    width: '32ch' 
                                }} 
                                error={itemTypeInvalid}
                            >
                                <InputLabel htmlFor="grouped-select" required>
                                    Item Type
                                </InputLabel>
                                <Select 
                                    disabled={disableTypeSelect}
                                    defaultValue={null}
                                    id="grouped-select" 
                                    label="Grouping"
                                    onChange={handleItemTypeSelect}
                                >
                                    {
                                        category === 'food' ?
                                        foodTypes.map((foodItem, index) => (
                                            <MenuItem value={foodItem._id} key={index + 1}>
                                                {foodItem.type}
                                            </MenuItem>
                                        )) :
                                        drinkTypes.map((drinkItem, index) => (
                                            <MenuItem value={drinkItem._id} key={index + 1}>
                                                {drinkItem.type}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <FormGroup>
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        disabled={isTimedSpecial || isRecurring}
                                        onChange={isSpecialToggle}
                                    />
                                } 
                                label="On Special"
                            />
                        </FormGroup>
          
                        <Fade in={isSpecial}>
                            {timedSpecialCheckbox}
                        </Fade>
                        <Collapse in={isTimedSpecial}>
                            <FormGroup>
                                <TimedSpecialForm 
                                    dateValue={dateValue}
                                    setDateValue={setDateValue}
                                    fromTime={fromTime}
                                    setFromTime={setFromTime}
                                    toTime={toTime}
                                    setToTime={setToTime}
                                    isRecurring={isRecurring}
                                    setIsRecurring={setIsRecurring}
                                    sundayTime={sundayTime}
                                    setSundayTime={setSundayTime}
                                    mondayTime={mondayTime}
                                    setMondayTime={setMondayTime}
                                    tuesdayTime={tuesdayTime}
                                    setTuesdayTime={setTuesdayTime}
                                    wednesdayTime={wednesdayTime}
                                    setWednesdayTime={setWednesdayTime}
                                    thursdayTime={thursdayTime}
                                    setThursdayTime={setThursdayTime}
                                    fridayTime={fridayTime}
                                    setFridayTime={setFridayTime}
                                    saturdayTime={saturdayTime}
                                    setSaturdayTime={setSaturdayTime}

                                />
                            </FormGroup>
                        </Collapse>
                        <Collapse in={isSpecial}>
                            <FormGroup>
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        onChange={recurringToggle}
                                    />
                                } 
                                label="Recurring"
                                />
                            </FormGroup>
                        </Collapse>
                        <Collapse in={isRecurring}>
                            <SpecialHoursForm 
                                sundayTime={sundayTime}
                                setSundayTime={setSundayTime}
                                mondayTime={mondayTime}
                                setMondayTime={setMondayTime}
                                tuesdayTime={tuesdayTime}
                                setTuesdayTime={setTuesdayTime}
                                wednesdayTime={wednesdayTime}
                                setWednesdayTime={setWednesdayTime}
                                thursdayTime={thursdayTime}
                                setThursdayTime={setThursdayTime}
                                fridayTime={fridayTime}
                                setFridayTime={setFridayTime}
                                saturdayTime={saturdayTime}
                                setSaturdayTime={setSaturdayTime}
                            />
                        </Collapse>  
                        
                        <Typography variant="h6">
                            Attach a photo of the menu
                        </Typography>
                        <UploadMenuItem />
                    
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddItem}>Add!</Button>
            </DialogActions>
        </Dialog>
        
        <AlertBar 
            show={show}
            setShow={setShow}
            message={message}
            severity={severity}
        />

      </LocalizationProvider>
    )
};



export default AddItemForm;