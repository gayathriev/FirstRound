import {
    Resolver,
    Mutation,
    PubSub,
    Arg,    
    Ctx,
    UseMiddleware
} from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { AppContext } from "src/shared-resources/utils/app.context";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { isBusiness } from "../../middleware/isBusiness";

// resolver imports
import { uploadMenuItem } from "../menus/menus.utils";
import {createVerificationRequest} from "../venue-requests/venue-requests.utils";

// input type imports
import { AddMenuItemInput } from "../menus/menus.input";


/**
 * File upload resolvers.
 * 
 * + Business verification 
 * + Menu uploads
 */


const pubBucketEndpoint = "https://firebasestorage.googleapis.com/v0/b";

// write files in the bucket under this ref
const bucketRef = 'files';


@Resolver()
export class UploadResolver {

    /**
     * @description
     * Mutation to upload verification documents
     * for business users claiming a venue and
     * to call relevant functions for adding to
     * administration dashboard for approval
     * 
     * @param venueID: the ID of the venue
     * @param bucket: the google storage bucket instance
     * @param jwtPayload: the user's JWT token
     * @param file: the file to upload
     * @returns a boolean to indicate successful upload
     */
    @UseMiddleware(Authorised, isBusiness)
    @Mutation(() => Boolean)
    async verificationUpload(
        @Arg("venueID") venueID: string,
        @Ctx() { bucket, jwtPayload }: AppContext,
        @Arg("file", () => GraphQLUpload)
    {
        createReadStream,
        filename,
        mimetype
    }: FileUpload): Promise<boolean> {
        console.log('Received', filename, "of type", mimetype);
        const meta = {
            contentType: mimetype
        }
        try {

            const newBucketFile = bucket.file(`${bucketRef}/${filename}`);
            const uploadStream = newBucketFile.createWriteStream(meta);

            return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(
                    uploadStream
                )
                .on("finish", ( ) => {
                    // save this url to the target schema as a string
                    const resourceURL = `${pubBucketEndpoint}/${bucket.name}/o/${bucketRef}%2F${
                                            encodeURI(filename)
                                            }?alt=media`
                    
                    // create the verification request
                    const confirmSave = createVerificationRequest (resourceURL, venueID, jwtPayload);
                    
                    console.log(`Upload Done, resource url: ${resourceURL}`)
                    resolve(true)
                })
                .on("error", (err: any) => {
                    console.error("Failed with: ", err);
                    reject(false);
                })
            });
        } catch (err) {

            //upload failed
            console.error(err);
            return false;
        }

    }


  
    /**
     * @description
     * Mutation to upload menu images
     * and verify them before uploading menu items
     * for all user-uploaded menu items
     * 
     * @param pubSub: the notification engine
     * @param bucket: the google storage bucket instance
     * @param jwtPayload: the user's JWT token
     * @param scheduler: the image recognition scheduler
     * @param menuItemData: menu item data to be uploaded\
     * @param venueID: the ID of the venue
     * @param file: the menu image file to upload
     * @returns a boolean to indicate a successful upload
     */
    @UseMiddleware(Authorised)
    @Mutation(() => Boolean)
    async menuItemUpload(
        @PubSub() pubSub: PubSubEngine,
        @Ctx() { bucket, jwtPayload, scheduler }: any,
        @Arg("menuItemData") menuItemData: AddMenuItemInput,
        @Arg("venueID") venueID: string,
        @Arg("file", () => GraphQLUpload)
    {
        createReadStream,
        filename,
        mimetype
    }: FileUpload): Promise<boolean> {

        const { name, price, isSpecial, itemKind, specialHours, specialExpiry } = menuItemData;
        
        const meta = { contentType: mimetype };
        
        try {
            
            // create temporary file in the bucket to verify with
            // tesseract engine
            const newBucketFile = bucket.file(`${bucketRef}/${filename}`);
            const uploadStream = newBucketFile.createWriteStream(meta);

            return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(
                    uploadStream
                )
                .on("finish", ( ) => {
                    // save this url to the target schema as a string
                    const resourceURL = `${pubBucketEndpoint}/${bucket.name}/o/${bucketRef}%2F${
                                            encodeURI(filename)
                                            }?alt=media`;
                    
                    console.log(`Upload Done, resource url: ${resourceURL}`);

                    uploadMenuItem(
                        name, 
                        price, 
                        itemKind,
                        isSpecial,
                        specialExpiry,
                        specialHours,
                        venueID,
                        jwtPayload,
                        scheduler,
                        resourceURL,
                        pubSub
                    )

                    resolve(true)
                })
                .on("error", (err: any) => {
                    console.error("Failed with: ", err);
                    reject(false);
                })
            });
        } catch (err) {

            //upload failed
            console.error(err);
            return false;
        }
    }
}