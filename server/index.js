import {InMemoryCache} from "apollo-cache-inmemory";
import {ApolloClient} from "apollo-client";
import {SchemaLink} from "apollo-link-schema";
import {apolloUploadExpress} from "apollo-upload-server";
import compression from "compression";
import express from "express";
import graphqlHTTP from "express-graphql";
import mongoose from "mongoose";
import sassMiddleware from "node-sass-middleware";
import path from "path";
import React from "react";
import {ApolloProvider, getDataFromTree} from "react-apollo";
import ReactDOMServer from "react-dom/server";
import {Route, StaticRouter} from "react-router";
import {resetIdCounter} from "react-tabs";
import secure from "ssl-express-www";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import App, {AppHelmet} from "../client/components/App";
import config from "../config/config";
import webpackConfig from "../webpack.config.js";
import schema from "./graphql/index";
import {shouldCompress} from "./helpers/helpers.js";
import Html from "./index.html.js";

const withColor = "\x1b[33m%s\x1b[0m"; //just added some fancy console output color

export const server = express();

//server side sass compilation - development - css will be pushed to production
if (config.nodeEnv === "development") {
    server.use(sassMiddleware({
        src: path.join(__dirname, "../client/scss"),
        dest: path.join(__dirname, "../client"),
        outputStyle: "compressed",
        force: true,
        sourceMap: true,
    }));

    //caching only in production
    server.set("cache", false);
}

//gzip compression
if (config.nodeEnv === "production") {
    server.use(compression({filter: shouldCompress}));
    server.use(secure);
}

//webpack config server usage
server.use(webpackMiddleware(webpack(webpackConfig)));

//mongodb connection
mongoose.connect(config.mongodbUri);

//jtw secret
server.set("superSecret", config.secret);

const db = mongoose.connection;
db.on("error", () => console.info("Failed to connect to DB."))
    .once("open", () => {
        console.info(withColor, "Connected to DB." + "\n");
        console.info("##########################################################\n");
    });

//setting up graphql api endpoint
server.use("/graphql",
    apolloUploadExpress(),
    graphqlHTTP(() => {
        return config.nodeEnv === "development" ?
            ({
                schema,
                pretty: true,
                graphiql: true
            }) : ({
                schema,
            });

    }));
//static file path
server.use(express.static(path.join(__dirname, "../client")));

//serverSide rendering
server.use("*", (req, res) => {
    //setting up graphql client - is required for creation of cache store
    const client = new ApolloClient({
        ssrMode: true,
        link: new SchemaLink({schema}),
        cache: new InMemoryCache(),
    });
    //context required for static router
    const context = {};
    // The client-side App will instead use <BrowserRouter>
    // serverside markup with apollo client - will e injected into html
    const Markup = (
        <ApolloProvider client={client}>
            <StaticRouter location={req.originalUrl} context={context}>
                <Route path="/"
                       render={(routerProps) => <App {...routerProps} ssr={true}/>}/>
            </StaticRouter>
        </ApolloProvider>
    );

    //serverside markup injection
    getDataFromTree(Markup).then(() => {
        //reset id counter of react tabs
        resetIdCounter();
        //render to string
        const content = ReactDOMServer.renderToString(Markup);
        //setting initial state
        const initialState = client.extract();

        const helmet = AppHelmet.renderStatic();

        const html = <Html content={content} state={initialState}
                           headers={
                               {
                                   title: helmet.title.toComponent(),
                                   desc: helmet.meta.toComponent()
                               }
                           }/>;

        res.status(200);

        res.send(`<!doctype html>\n${ReactDOMServer.renderToString(html)}`);
        res.end();
    });
});


server.listen(config.port, config.host, () => {
    console.info("##########################################################");
    console.info("#####               STARTING SERVER                  #####");
    console.info("##########################################################\n");
    console.info(withColor, "App running in  " + config.nodeEnv + " mode \n");
    console.info(withColor, "Express listening on " + config.serverUrl + "\n");
    console.info(withColor, "GraphQL console: " + config.serverUrl + "/graphql" + "\n");
    console.info(withColor, "Compiling ...\n");
});
