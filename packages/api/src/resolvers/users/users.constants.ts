/***
 * @description
 * Error message constants.
 * 
 * Invalid credentials message
 * is intentionally vague to avoid
 * email or username enumeration.
 */
 export const invalidCredentialsMsg: string = "Invalid username or password";
 export const usernameTaken: string = "Username is taken";
 export const emailTaken: string = "Email is taken";
 export const taken: string = "Username or Email is taken";
 export const notAllowedMsg: string = "Not allowed";
 export const emailSent: string = "Email sent!";
 
/**
 * @description
 * reset token expiry (seconds)
 */
 export const resetTokenExpiry = 3600000;
 
/**
 * @description
 * Defines user types for the platform
 */
 export enum UserType {
     ADMIN = "Admin",
     BUSINESS = "Business",
     CUSTOMER = "Customer"
 }