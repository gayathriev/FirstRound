import React, { useEffect } from "react";
import { uppy } from './uppyConfig';
import { useMutation, gql } from "@apollo/client";
import Zone from './Zone';

const UPLOAD_FILE = gql`
    mutation verificationUpload($file: Upload!, $venueID: String!) {
        verificationUpload(file: $file, venueID: $venueID)
    }
`;

/**
 * verification document upload component.
*/
const VerificationUpload = (props) => {
    const [uploadFile] = useMutation(UPLOAD_FILE, {
        onCompleted: (data) => {
            console.log('Done with', data)
        }
    });

    const initUpload = async ( file, venueID ) => {
        if (venueID !== "") {
            await uploadFile({ variables: { file, venueID } })
                .then(() => {
                    console.log('File uploaded');
                    uppy.reset();
                    props.refetchQuery();
                }).catch(err => {
                    console.error(err);
                });
        }
    }

    useEffect(() => {
        const { venueID } = props;
        const handler = () => {
            uppy.getFiles().forEach(file => {
                initUpload(file.data, venueID);
            });
        };
        uppy.on('upload', handler);

        return () => {
            uppy.off('upload', handler);
        };
    }, [props.venueID]);

    useEffect(() => {
        const handler = (file) => {
            props.setShowCallback(true);
            props.setFileCallback(file.id);
        }

        uppy.on('file-added', handler);
        
        return () => {
            uppy.off('file-added', handler);
        };
    }, [])

    useEffect(() => {
        const handler = () => {
            props.setFileCallback(false);
        }

        uppy.on('file-removed', handler);
        
        return () => {
            uppy.off('file-removed', handler);
        };
    }, [])

    return (
        <Zone uppy={uppy}/>
    )
}

export default VerificationUpload;