import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';

/**
 * Initiate firebase service account
 */
const serviceAccount = process.env.FIRESTORE_CONF as string;

/**
 * @description
 * Configure a firebase cloud storage instance
 * using the admin service account SDK and return
 * a Bucket object to interact with a Cloud Storage 
 * bucket. 
 * 
 * @returns Bucket
 */
export default async function initBucket() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.BUCKET_NAME
    });
    const bucket: Bucket = admin.storage().bucket();

    console.log("[>>] Storage bucket connected 🪣");
    return bucket;
}; 