import { AppContext } from "src/shared-resources/utils/app.context";
import { MiddlewareFn } from "type-graphql";
import { Secret, verify } from "jsonwebtoken";
import { tokenIdentifier } from "../shared-resources/utils/jwt.strategy";

/** 
 * @description
 * Middleware check if the request inbound on 
 * a resolver contains a valid JWT 🍪
 * auth token.
 * 
 * @returns next middleware or resolver
 */
export const Authorised: MiddlewareFn<AppContext> = async ({ context }, next) => {
    const { req } = context;
    const authToken = req.cookies;

    // check if token is present
    if (!authToken[tokenIdentifier]) {
        console.log("[**] No macaroon was present in the request 🍪");
        return "No auth token";
    }

    // check if token is valid
    try {
        const payload = verify(
            authToken[tokenIdentifier], 
            process.env.JWT_SECRET as Secret
        );

        // save the payload to the context
        // to retrieve it in resolvers
        context.jwtPayload = payload as any;
        
    } catch (err) {
        console.log("[**] Macaroon verification failed, likely expired or forged 😧");
        return "Invalid auth token";
    }
   
    // next middleware or resolver
    return await next();
};
