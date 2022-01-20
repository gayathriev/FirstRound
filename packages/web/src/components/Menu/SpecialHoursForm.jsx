import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';

const SpecialHoursForm = ({ 
    sundayTime, setSundayTime,
    mondayTime, setMondayTime,
    tuesdayTime, setTuesdayTime,
    wednesdayTime, setWednesdayTime,
    thursdayTime, setThursdayTime,
    fridayTime, setFridayTime,
    saturdayTime, setSaturdayTime,
 }) => {

    return (
        <FormControl
            sx={{
                '& .MuiTextField-root': { m: 0.5, width: '32ch' },
                textAlign: 'left'
            }}
        >

            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Sunday'
                            onChange={(event) => {
                                setSundayTime({
                                    set: event.target.checked,
                                    from: sundayTime.from,
                                    to: sundayTime.to
                                });
                            }}
                        />
                    } 
                    label='Sunday' 
                />
                <div>
                    <TimePicker
                        disabled={!sundayTime.set}
                        label="From"
                        value={sundayTime.from}
                        onChange={(newValue) => {
                            setSundayTime({
                                set: sundayTime.set,
                                from: newValue,
                                to: sundayTime.to
                            });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!sundayTime.set}
                        label="To"
                        value={sundayTime.to}
                        onChange={(newValue) => {
                            setSundayTime({
                                set: sundayTime.set,
                                from: sundayTime.from,
                                to: newValue
                            });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>


            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Monday'
                            onChange={(event) => {
                                setMondayTime({
                                    set: event.target.checked,
                                    from: mondayTime.from,
                                    to: mondayTime.to
                                });
                            }}
                        />
                    } 
                    label='Monday'
                />
                <div>
                    <TimePicker
                        disabled={!mondayTime.set}
                        label="From"
                        value={mondayTime.from}
                          onChange={(newValue) => {
                            setMondayTime({
                                set: mondayTime.set,
                                from: newValue,
                                to: mondayTime.to
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!mondayTime.set}
                        label="To"
                        value={mondayTime.to}
                        onChange={(newValue) => {
                            setMondayTime({
                                set: mondayTime.set,
                                from: mondayTime.from,
                                to: newValue
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>


            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Tuesday'
                            onChange={(event) => {
                                setTuesdayTime({
                                    set: event.target.checked,
                                    from: tuesdayTime.from,
                                    to: tuesdayTime.to
                                });
                            }}
                        />
                    } 
                    label='Tuesday'
                />
                <div>
                    <TimePicker
                        disabled={!tuesdayTime.set}
                        label="From"
                        value={tuesdayTime.from}
                          onChange={(newValue) => {
                            setTuesdayTime({
                                set: tuesdayTime.set,
                                from: newValue,
                                to: tuesdayTime.to
                            })
            
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!tuesdayTime.set}
                        label="To"
                        value={tuesdayTime.to}
                        onChange={(newValue) => {
                            setTuesdayTime({
                                set: tuesdayTime.set,
                                from: tuesdayTime.from,
                                to: newValue
                            })
                          
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>

            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Wednesday'
                            onChange={(event) => {
                                setWednesdayTime({
                                    set: event.target.checked,
                                    from: wednesdayTime.from,
                                    to: wednesdayTime.to
                                });
                            }}
                        />
                    } 
                    label='Wednesday'
                />
                <div>
                    <TimePicker
                        disabled={!wednesdayTime.set}
                        label="From"
                        value={wednesdayTime.from}
                          onChange={(newValue) => {
                            setWednesdayTime({
                                set: wednesdayTime.set,
                                from: newValue,
                                to: wednesdayTime.to
                            })
                   
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!wednesdayTime.set}
                        label="To"
                        value={wednesdayTime.to}
                        onChange={(newValue) => {
                            setWednesdayTime({
                                set: wednesdayTime.set,
                                from: wednesdayTime.from,
                                to: newValue
                            })
  
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>


            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Thursday'
                            onChange={(event) => {
                                setThursdayTime({
                                    set: event.target.checked,
                                    from: thursdayTime.from,
                                    to: thursdayTime.to
                                });
                            }}
                        />
                    } 
                    label='Thursday'
                />
                <div>
                    <TimePicker
                        disabled={!thursdayTime.set}
                        label="From"
                        value={thursdayTime.from}
                          onChange={(newValue) => {
                            setThursdayTime({
                                set: thursdayTime.set,
                                from: newValue,
                                to: thursdayTime.to
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!thursdayTime.set}
                        label="To"
                        value={thursdayTime.to}
                        onChange={(newValue) => {
                            setThursdayTime({
                                set: thursdayTime.set,
                                from: thursdayTime.from,
                                to: newValue
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>


            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Friday'
                            onChange={(event) => {
                                setFridayTime({
                                    set: event.target.checked,
                                    from: fridayTime.from,
                                    to: fridayTime.to
                                });
                            }}
                        />
                    } 
                    label='Friday'
                />
                <div>
                    <TimePicker
                        disabled={!fridayTime.set}
                        label="From"
                        value={fridayTime.from}
                          onChange={(newValue) => {
                            setFridayTime({
                                set: fridayTime.set,
                                from: newValue,
                                to: fridayTime.to
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!fridayTime.set}
                        label="To"
                        value={fridayTime.to}
                        onChange={(newValue) => {
                            setFridayTime({
                                set: fridayTime.set,
                                from: fridayTime.from,
                                to: newValue
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>


            <div>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            id='Saturday'
                            onChange={(event) => {
                                setSaturdayTime({
                                    set: event.target.checked,
                                    from: saturdayTime.from,
                                    to: saturdayTime.to
                                });
                            }}
                        />
                    } 
                    label='Saturday'
                />
                <div>
                    <TimePicker
                        disabled={!saturdayTime.set}
                        label="From"
                        value={saturdayTime.from}
                          onChange={(newValue) => {
                            setSaturdayTime({
                                set: saturdayTime.set,
                                from: newValue,
                                to: saturdayTime.to
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                    <TimePicker
                        disabled={!saturdayTime.set}
                        label="To"
                        value={saturdayTime.to}
                        onChange={(newValue) => {
                            setSaturdayTime({
                                set: saturdayTime.set,
                                from: saturdayTime.from,
                                to: newValue
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDateTime={new Date()}
                    />
                </div>
            </div>

        </FormControl>
    )
};



export default SpecialHoursForm;