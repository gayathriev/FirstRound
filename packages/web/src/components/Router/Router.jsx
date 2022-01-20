import React from 'react';
import { 
    ApolloClient, 
    InMemoryCache
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { createUploadLink } from 'apollo-upload-client';
import { split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { 
    BrowserRouter, 
    Route, 
    Switch 
} from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { UserTypes } from '../../constants/userTypes';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Forgot from '../../pages/Forgot'
import AdminDashboard from '../../pages/AdminDashboard'
import BusinessDashboard from '../../pages/BusinessDashboard'
import Reset from '../../pages/Reset';
import Profile from '../../pages/Profile';


/**
 * Router components -> Routes our web app
 * to their correct page
 * 
 */

export const authToken = localStorage.getItem('sesh');

/**
 * apollo client only allows one terminating
 * link that sends gql requests, so we need
 * to split between the websocket service
 * and the http service. Note the http
 * service itself also splits based on 
 * weather the gql variable contains
 * files.
 */


/** websocket handler */
const wsService = new WebSocketLink({
    uri: 'ws://localhost:2048/graphql',
    options: {
        // if ws dies attempt reconnect
        reconnect: true,
        connectionParams: {
            // send the token on connection,
            // will be used on subsequent reconnects
            authToken: authToken
        } 
    }, 
});

/**
 * split between regular http service or 
 * file upload service based on weather the
 * gql query contains file variable(s)
 */
const httpUploadServiceSplitter = createUploadLink({
    uri: 'http://localhost:2048/graphql',
    credentials: 'include'
});



/**
 * Split the listening client instance
 * between HTTP and WebSocket based on the 
 * graphql query type
 * 
 * @subscription WS
 * @Query HTTP
 * @Mutation HTTP ->  if files -> uploadLink
 */
const splitService = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsService,
    httpUploadServiceSplitter
);


// Create an apollo client instance
const client = new ApolloClient({
    link: splitService,
    cache: new InMemoryCache(),
});


/**
 * Pass props to the router to
 * dictate what type of login
 * and register is required 
 * */
export const Router = () => (
    <CookiesProvider>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" 
                        component={Home} 
                    />
                    <Route exact path="/login" >
                        <Login userType={UserTypes.CUSTOMER} />
                    </Route>
                    <Route exact path="/register"> 
                        <Register userType={UserTypes.CUSTOMER}/>
                    </Route>
                    <Route exact path="/register-business">
                       <Register userType={UserTypes.BUSINESS}/> 
                    </Route>
                    <Route exact path="/business"
                        component={BusinessDashboard}
                    />
                    <Route exact path="/admin" 
                        component={AdminDashboard} 
                    />
                    <Route exact path="/forgot" 
                        component={Forgot}
                    />
                    <Route exact path="/reset" 
                        component={Reset}
                    />
                    <Route exact path="/profile" 
                        component={Profile}
                    />
                    <Route exact path="/menu/:venueID" 
                        component={Home}
                    />
                    <Route exact path="/route/:routeID" 
                        component={Home}
                    />
                </Switch>
            </BrowserRouter>
        </ApolloProvider>
    </CookiesProvider>
);

export default Router;