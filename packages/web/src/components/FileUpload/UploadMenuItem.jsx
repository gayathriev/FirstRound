import React from 'react';
import { uppy } from './uppyConfig';
import Zone from './Zone';


const UploadMenuItem = () => {
    return (
       <Zone uppy={uppy} />
    )
};

export default UploadMenuItem;