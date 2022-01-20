import React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';

const DateForm = ({
    dateValue, setDateValue,
}) => {

    return (
        <>
            <DateRangePicker
                disablePast
                calendars={1}
                value={dateValue}
                onChange={(newValue) => {
                    setDateValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                    <TextField {...startProps} />
                    <TextField {...endProps} />
                    </React.Fragment>
                )}
            />
            <br />
        </>
    )
};



export default DateForm;