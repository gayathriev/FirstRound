import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import TimePicker from '@mui/lab/TimePicker';


const TimedSpecialForm = ({
    dateValue, setDateValue,
    fromTime, setFromTime,
    toTime, setToTime
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
            <div>
                <TimePicker
                    label="Available From"
                    value={fromTime}
                    onChange={(newValue) => {
                        setFromTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    minDateTime={new Date()}
                />
                <TimePicker
                    label="Available To"
                    value={toTime}
                    onChange={(newValue) => {
                        setToTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    minDateTime={new Date()}
                />
            </div>
        </>
    )
};


export default TimedSpecialForm;