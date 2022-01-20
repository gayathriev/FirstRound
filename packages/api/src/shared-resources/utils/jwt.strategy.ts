import { sign } from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { Secret, verify } from 'jsonwebtoken';

/**
 * @module JwtStrategy
 * Implements the behaviour to
 * create tokens to return to the
 * frontend. 
 */

// cookie expiry time
const expiryTime = '2d';
// cookie name (as it appears in browser)
export const tokenIdentifier = 'sesh';

/**
 * @description
 * Creates a JSON Web access token
 * storing the ID, username and type of user
 * 
 * @param userID: the ID of the user
 * @param username: the username 
 * @param userType: the type of user (Customer, Admin or Business) 
 * @returns the newly created JSON Web Token
 */
export const createAccessToken = async (userID: string, username: string, userType: string) => {
    const token = sign(
        {userID: userID, username, userType}, 
        process.env.JWT_SECRET as string, 
        { expiresIn: expiryTime}
    );

    return `${token}`;
}

/**
 * @description
 * Returns cookie options to be 
 * used in the cookie payload.
 * 
 * @param token: @angus 
 * @returns cookieOptions @angus
 */
export const configCookie = (token: string) => {
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'none',
        secure: true, 
    }

    return {
        name: tokenIdentifier,
        val: token,
        options: cookieOptions
    }
}



/**
 * @description
 * Validate a JWT token
 * 
 * @param token: the user's JWT token
 * @returns the payload from verifying and decoding the token 
 */
export const validateAuthToken = async (token: string) => {
    const tokenPayload = verify(
        token, 
        process.env.JWT_SECRET as Secret
    );
    return tokenPayload;
} 