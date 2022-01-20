import { AppContext } from "src/shared-resources/utils/app.context";
import { MiddlewareFn } from "type-graphql";
import { UserType } from "../resolvers/users/users.constants";

const defaultError = 'Not authorised';


/**
 * @description
 * Middleware to check if the user is a 
 * business following a authorised request.
 * Authorised middleware must be called
 * before this middleware.
 * 
 * @returns next middleware or resolver
 */
export const AdminRoute: MiddlewareFn<AppContext> = async ({ context }, next) => {
    const { jwtPayload } = context;
  
    // the jwtPayload was not populated, so throw warning
    if (!jwtPayload) {
        console.warn(
            "[**] Authorised middleware must be called before this middleware!"
        );
        return 'Not authorized';
    }

    // check if user is an admin
    if (jwtPayload.userType !== UserType.ADMIN) 
        return defaultError;

    // else next middleware or resolver
    return await next();
};