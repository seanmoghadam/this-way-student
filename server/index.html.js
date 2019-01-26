import React from "react";
import config from "../config/config";


//is required for serverside rendering - this initializes the app
function Html({content, state, headers}) {

    return (
        <html lang="en">
        <head>
            <link rel="shortcut icon" href="/images/favicon.ico"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="theme-color" content="#f03931"/>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="/style.css" type="text/css"/>
            {headers.title}
            {headers.desc}
        </head>

        <body>
        <noscript className="alert-danger alert">Please Enable JAVASCRIPT for better user experience. Many functions
            could also not work either.
        </noscript>
        <div id="root" dangerouslySetInnerHTML={{__html: content}}/>
        {/*initialize data for rendering - only content no user data*/}
        <script dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, "\\u003c")};`,
        }}/>
        <script src="/bundle.js"/>
        {config.nodeEnv === "development" && <script src="http://localhost:8081/livereload.js"/>}
        </body>
        </html>
    );
}

export default Html;
