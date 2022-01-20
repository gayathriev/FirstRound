import React from 'react';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

const Zone = ({ uppy }) => {
    return (
        <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
            height='33vh'
            width='100%'
            hideUploadButton={true}   // use custom trigger
        />
    )
};



export default Zone;