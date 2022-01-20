import { Bucket } from '@google-cloud/storage';
import {Request, Response} from 'express';

/**
 * @description
 * An interface for using
 * JWT Tokens
 * 
 * @field userID: the user's unique ID
 * @field username: the username
 * @field userType: admin, business or customer
 */
interface jwtPayload {
    userID: string;
    username: string;
    userType: string;
}

/**
 * @description
 * Expose various express objects
 * to resolvers.
 * 
 * @field req: the request body
 * @field res: the response body
 * @field bucket: @angus
 * @field jwtPayload: the JWT Token [optional]
 */
export interface AppContext {
    req: Request;
    res: Response;
    bucket: Bucket;

    jwtPayload?: jwtPayload;
}