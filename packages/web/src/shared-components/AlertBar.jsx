import React, { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AlertBar = ({
    show, setShow,
    message, severity
}) => {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setShow(false);
    };

    return (
        <Snackbar open={show} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                { message }
            </Alert>
        </Snackbar>
    )
};



export default AlertBar;