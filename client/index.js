import {InMemoryCache} from "apollo-cache-inmemory";
import {persistCache} from "apollo-cache-persist";
import {ApolloClient} from "apollo-client";
import {ApolloLink} from "apollo-link";
import {createUploadLink} from "apollo-upload-client";
import React from "react";
import {ApolloProvider} from "react-apollo";
import ReactDOM from "react-dom";
import {BrowserRouter, Route} from "react-router-dom";
import App from "./components/App";


const httpLink = createUploadLink({uri: "/graphql"});

if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js");


        /*navigator.serviceWorker.getRegistrations().then(function (registrations) {

            for (let registration of registrations) {

                registration.unregister();

            }
        }).catch(function (err) {
            console.info("Service Worker registration failed: ", err);
        });*/

    });
}

const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token") || ""
        }
    });
    return forward(operation);
});

let cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

// use with apollo-client
const link = middlewareLink.concat(httpLink);

let client = new ApolloClient({
    cache,
    link,
    ssrForceFetchDelay: 100,
});

try {
    // See above for additional options, including other storage providers.
    persistCache({
        cache,
        storage: window.localStorage,
    }).then((updatedClient) => {

        client = updatedClient;


    });
} catch (error) {
    console.error("Error restoring Apollo cache", error);
}


ReactDOM.hydrate(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <Route path="/" render={(routerProps) => <App {...routerProps} client={client}/>}/>
        </BrowserRouter>
    </ApolloProvider>
    , document.querySelector("#root")
);