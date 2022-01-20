import { 
    Resolver,  
    Ctx,
    Query,
    UseMiddleware,
} from "type-graphql";

// middleware imports
import { Authorised } from "../../middleware/Authorised";
import { isBusiness } from "../../middleware/isBusiness";
import { AdminRoute } from "../../middleware/AdminRoute";


@Resolver()
export class HealthResolver {
    /**
     * @description
     * Check that the GQL endpoint is functional
     * 
     * @returns A string confirming the endpoint is alive
     */
    @Query(() => String)
    health() {
        return `GQL endpoint Alive @ ${new Date().toISOString()}`
    }

    /**
     * @description
     * Tests the functionality of the Authorised middleware
     * 
     * @param jwtPayload: The JSON Web Token with user information
     * @returns A string confirming the middleware has worked 
     */
    @UseMiddleware(Authorised)
    @Query(() => String)
    middlewareHealth(
        @Ctx() { jwtPayload }: any
    ) {
        console.log("[>>] Got from ctx ::", jwtPayload);

        /**
         * Can now check various things from the context
         * about the user such as,
         * `jwtPayload.userID`
        */
        return `Resolver protected by middleware hit @ ${new Date().toISOString()}`;
    }

    /**
     * @description
     * Test resolver to check admin-protected resolvers are functional
     * 
     * @param name: jwtPayload: The user's JWT token
     * @returns A confirmation string
     * 
     * @note
     * For resolvers protected with multiple middlewares,
     * Authorised must be called first
     */
    @UseMiddleware(Authorised, AdminRoute)
    @Query(() => String)
    adminHealth(
        @Ctx() { jwtPayload }: any
    ) {
        console.log("[>>] Got from ctx ::", jwtPayload);
        return `Admin resolver protected by middleware hit @ ${new Date().toISOString()}`;
    }

    /**
     * @description
     * Test resolver to check business-protected resolvers are functional
     * 
     * @param name: jwtPayload: The user's JWT token
     * @returns A confirmation string
     * 
     * @note
     * For resolvers protected with multiple middlewares,
     * Authorised must be called first
     */
    @UseMiddleware(Authorised, isBusiness)
    @Query(() => String)
    businessHealth(
        @Ctx() { jwtPayload }: any
    ) {
        console.log("[>>] Got from ctx ::", jwtPayload);
        return `Business resolver protected by middleware hit @ ${new Date().toISOString()}`;
    }
}