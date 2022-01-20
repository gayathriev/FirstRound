import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from "http";
import { graphqlUploadExpress } from 'graphql-upload';
import { Bucket } from '@google-cloud/storage';

// init imports
import connectDB from './init/connectDB'; 
import initBucket from './init/initBucket';
import { initImageRecognition } from './init/initImageRecognition';
import { initCron } from "./init/initCron";

// resolver imports
import { HealthResolver } from './resolvers/health/health.resolver';
import { 
    CustomerResolver, 
    BusinessResolver, 
    AdminResolver, 
    UserResolver,
} from "./resolvers/users/users.resolver";
import { VenueResolver } from "./resolvers/venues/venues.resolver"
import { UploadResolver } from './resolvers/upload/upload.resolver';
import { VenueRequestsResolver } from './resolvers/venue-requests/venue-requests.resolver';
import { MenuResolver } from './resolvers/menus/menus.resolver';
import { NotificationsResolver } from './resolvers/notifications/notifications.resolver';
import { ShareResolver } from './resolvers/share/share.resolver';
import { MenuVerificationResolver } from './resolvers/menu-verification/menu-verification.resolver';
import { validateAuthToken } from './shared-resources/utils/jwt.strategy';
import { PromotionsResolver } from './resolvers/promotions/promotions.resolver';
import { RouteResolver } from './resolvers/routes/routes.resolver';

/**
 *  <-------------X EXPRESS IMPORTS X------------->
*/
import usePromotion from './express-routes/use-promotion';


(async () => {

    // switch origin based on node environment
    // to handel CORS wanting the port set
    let origin: string;
    switch (process.env.NODE_ENV) {
        case 'PLAYGROUND':
            origin = process.env.PLAYGROUND_OG!;
            break;
        case 'PROD':
            origin = process.env.PRODUCTION_OG!;
            break;
        default:
            origin = process.env.CLIENT_ORIGIN!;
    }

    const corsOptions = {
        origin: origin,
        credentials: true,
    }

    const orm = await connectDB();
    const bucket: Bucket = await initBucket();
    const scheduler = await initImageRecognition();
    
    initCron();


    const app = express();
    const httpServer = createServer(app);   


    const schema =  await buildSchema({
            resolvers: [
                HealthResolver, 
                VenueResolver, 
                CustomerResolver, 
                BusinessResolver, 
                AdminResolver,
                UserResolver,
                UploadResolver,
                VenueRequestsResolver,
                MenuResolver,
                NotificationsResolver,
                ShareResolver,
                MenuVerificationResolver,
                PromotionsResolver,
                RouteResolver
            ],
            // don't validate classes
            validate: true, 
        })     


    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,

        onConnect: async (
            connectionParams: any,
        ) => {

            /**
             * We have two options here:
             * 1. Use the connectionParams to get the user's
             *    access token (stored in localStorage)
             * 2. Use the webSocket to get the cookie from the
             *   initial HTTP upgrade req that happens when the
             *   socket connects.
             * 
             * The second option is easier from a client side
             * perspective since no change to how the client
             * works is required. However, doing this leads
             * to a potential security issue: Cross-site WS
             * Hijacking (CSWSH). It is also potentially more
             * unreliable if the initial upgrade request 
             * does not fire. Thus the first option is used.
             */

            if (connectionParams.authToken) {
                const jwtPayload = await validateAuthToken(connectionParams.authToken);
                if (!jwtPayload)
                    throw new Error('Invalid auth token');

                return jwtPayload;
            } 
            else 
                throw new Error('Missing token!');
        }
    }, {
        server: httpServer,
        path: '/graphql'
    });

    const server = new ApolloServer({
        schema: schema,
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }    
        }],
        context: ({ req, res }) => ({ orm, req, res, bucket, scheduler }),
    });

    // express endpoint health check
    app.get('/health', (_, res) => {
       res.send(`Express Server alive @ ${new Date()}`) 
    });

    // express endpoint for QR code scans
    app.use('/promotion', usePromotion);

    // start --> middleware --> listen 
    await server.start();
    app.use(graphqlUploadExpress());
    app.use(cookieParser());

    server.applyMiddleware({ app, cors: corsOptions });



    const port = process.env.PORT || 2048;
    httpServer.listen(port, async () => {
        console.log(`[>>] HTTP Server running @http://localhost:${port}/graphql 📟`);
        console.log(`[>>] Subscription Server running @ws://localhost:${port}/graphql 🪝`);
        console.log(`[>>] Configured for origin ${origin}`);
    });
})();