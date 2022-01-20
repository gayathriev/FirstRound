import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import Slide from '@mui/material/Slide'; 
import DateAdapter from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AddPromotion } from './addPromotion.gql';
import Typography from '@mui/material/Typography';


import DateForm from './DateForm';
import 'semantic-ui-less/semantic.less';
import { GET_MY_VENUES } from './getMyVenues.gql';


/**
 * 
 * @param {*} param0  
 */
const AddPromoForm = ({
    venueID, 
    setOpen, 
    checkedItems,
    setShow,
    setAlertMessage,
    setSeverity,
    refetchVenues
}) => {

    const [percentage, setPercentage ] = useState(0);
    const [points, setPoints ] = useState(0);
    const [dateValue, setDateValue] = useState([new Date(), new Date()]);

    // form error states
    const [percentageError, setPercentageError] = useState(false);
    const [pointsError, setPointsError] = useState(false);
    const [dateError, setDateError] = useState(false);


    const handleClose = () => {
        setPercentage(0.0);
        setPoints(0.0);
        setDateValue([new Date(), new Date()]);
        setOpen(false);
    };

    const [ addPromotion ] = useMutation(AddPromotion, {
        onCompleted: (res) => {
            console.log('[>>] Upload Menu Item Done', res);
            
            if (res.errors) {
                setAlertMessage('Failed to Start Promotion, please try again');
                setSeverity('error');
                setShow(true);
                handleClose();
            } else {
                setAlertMessage('Promotion Started!');
                setSeverity('success');
                setShow(true);
                handleClose();
            }
        },
        refetchQueries: [GET_MY_VENUES]
    });
   
    const handleApplyPromotion = () => {
        setPercentageError(false);
        setPointsError(false);
        setDateError(false);

        if (!percentage || !points || !dateValue) {
            if (!percentage) 
                setPercentageError(true);
            if (!points) 
                setPointsError(true);
            if (!dateValue) 
                setDateError(true);

            setAlertMessage('Please fill out all fields');
            setSeverity('error');
            setShow(true);
            return;
        }

        if (checkedItems.length === 0 ) {
            setAlertMessage('Please select menu items!');
            setSeverity('error');
            setShow(true);
            return;
        }

        if (percentage < 1 || percentage > 100) {
            setPercentageError(true);
            setAlertMessage('Percentage must be between 1-100');
            setSeverity('error');
            setShow(true);
            return;
        }

        if (points < 1 ) {
            setPointsError(true);
            setAlertMessage('Credits must be more than 0');
            setSeverity('error');
            setShow(true);
            return;
        }

        addPromotion({
            variables: {
                promotionInput: {
                    creditsRequired: points,
                    startDate: dateValue[0],
                    endDate: dateValue[1],
                    percentageOff: percentage,
                    menuItemIDs: checkedItems
                },
                venueID: venueID,
            }
        })

    }

    const handlePercentage = (event) => setPercentage(Number(event.target.value));
    const handlePoints = (event) => setPoints(Number(event.target.value));
    

    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
    
            <Box 
                noValidate
                autoComplete="off"
                component="form"  
                sx={{
                    //paddingLeft: '20%',
                    aligntItems: 'center',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    //textAlign: 'center'
                }}  
            >
                <FormControl 
                    variant='standard'  
                    sx={{ 
                        '& > :not(style)': { m: 1 }, 
                        '& .MuiTextField-root': { m: 0.5, width: '40%'},
                        aligntItems: 'center',
                        marginRight: 'auto',
                        marginLeft: 'auto'
                    }} 
                >
                <div>
                    <TextField 
                        id="outlined-number" 
                        type='number'
                        required
                        label="Percentage Off" 
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                                %
                                            </InputAdornment>,
                            inputProps: { min: 0, max: 100}
                        }}
                        onChange={handlePercentage}
                        error={percentageError}
                    />
                    <TextField
                        id="outlined-number"
                        label="Points"
                        type="number"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                                #
                                            </InputAdornment>,
                            inputProps: { min: 0}
                        }}
                        onChange={handlePoints}
                        // style={{width: '50%', marginLeft: '20%'}}
                        min={0}
                        error={pointsError}
                    />
                </div>               
                    <DateForm 
                        dateValue={dateValue}
                        setDateValue={setDateValue}
                    />
            </FormControl>
            <br />
            <Box sx={{ml: 1.2}}>
                <Button
                    sx={{mr: 2}} 
                    onClick={handleClose}
                    variant="outlined"
                    color="error"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleApplyPromotion}
                    variant="outlined"
                    color="success"
                >
                    Apply!
                </Button> 
            </Box>
        </Box>
      </LocalizationProvider>
    )
};



export default AddPromoForm;