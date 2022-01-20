import { randomBytes } from 'crypto';

/**
 * @description
 * Strategy for generating reset 
 * tokens. Reset tokens are ephemeral 
 * pseudo-random strings with an expiry.
 * 
 * @notes
 * I didn't like the JWT method because the reset
 * token the user entered was big and disgusting
 * 
 * @returns a key that is only valid for 1 hour
 */
export const genResetToken = async () => {
    // generate random string using crypto
    const ephemeralKey = randomBytes(10).toString('hex');
    return ephemeralKey;
};