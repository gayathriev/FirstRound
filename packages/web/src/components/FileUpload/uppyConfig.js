import Uppy from '@uppy/core';
/**
 * Uppy package config
 */
export const uppy = new Uppy({
    meta: { 
        type: 'verification',
    },
    restrictions: { 
        maxNumberOfFiles: 1, 
        maxFileSize: 5000000, 
        minNumberOfFiles: 1 
    },
    autoProceed: false,
    formData: true,
    allowMultipleUploadBatches: true,
});


/***
 * Notes on uppy:
 * 
 * - the uppy.upload() method
 * should be triggered by the
 * onClick event of the form
 * button in the higher order
 * component. However this creates
 * issues because the uppy object
 * needs to be given to a higher
 * order component. This is a
 * anti-pattern (most likely).
 * 
 * - Probably want to do something
 * with callbacks to a higher order
 * handler 
 * 
 * - For now the inbuilt upload button
 * is used 
 * 
 * - can use getFile() to get the file
 * object with the ids from the uppy
 * result object
 * 
 * - on complete fires after upload
 * 
 * - upload fires twice on upload ??
 * and will fire on any file add 
 * unless the autoProceed is set to
 * false
 * 
 * the uppy.upload method can be called
 * to fire all of this logic from the
 * form button click event ideally
 */