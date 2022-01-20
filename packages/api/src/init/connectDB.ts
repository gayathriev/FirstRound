import { connect } from 'mongoose';

// remote database url
const databaseURL: string = process.env.DB_URI as string;

/**
 * @description
 * Initiates a connection to the remote
 * MongoDB database
 * 
 * @returns a DBMS manager instance
 */
export default async function connectDB() {
    const orm: any = await connect(databaseURL, {}
    ).then(() => {
        console.log(`[>>] DB Connected 🛢️`);
    }).catch((err) => {
        console.log(`[>>] DB Connection Error: ${err}`);    
    });

    return orm;
}