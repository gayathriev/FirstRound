import { createWorker, createScheduler } from 'tesseract.js';

/**
 * @description
 * Initialise an image recognition worker to run on a separate thread
 * and initialise the scheduler to queue and schedule
 * jobs for that worker
 * Adapted from the Tesseract Typescript example usage
 * Available at: https://github.com/jeromewu/tesseract.js-typescript/
 * 
 * @returns the newly created scheduler (which has the
 *          associated worker)
 */
export const initImageRecognition = async () => {

    const scheduler = createScheduler();
    const worker = createWorker({ });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // add the worker to the scheduler
    scheduler.addWorker(worker);

    console.log('[>>] OCR engine started 👁️');
    return scheduler;
}