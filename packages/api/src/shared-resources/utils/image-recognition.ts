/**
 * @description
 * Run optical character recognition
 * on an image and return the text
 * 
 * @notes
 * Adapted from the Tesseract Typescript example usage
 * Available at:
 * https://github.com/jeromewu/tesseract.js-typescript/
 * 
 * @param imageURL: the URL of the uploaded image
 * @param scheduler: the image recognition scheduler
 * @returns the text from the image
 */
export async function imageRecognition (
    imageURL: string,
    scheduler: Tesseract.Scheduler
) {
    // add my job to the scheduler
    // await on my job specifically
    // return the text
    const { data: { text } } = await scheduler.addJob('recognize', imageURL);
    return text
}

