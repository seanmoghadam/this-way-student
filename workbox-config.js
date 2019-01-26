module.exports = {
    globDirectory: "client/",
    globPatterns: [
        "**/*.{jsx,ai,json,ttf,js,jpg,png,ico,svg,scss,css}"
    ],
    swDest: "client/sw.js",
    globIgnores: [
        "components/**",
        "graphql/**",
        "scss/**",
        "helpers.js",
        "routes.js"
    ],
    navigateFallback: "/",
    templatedUrls: {
        "/": ["bundle.js"],
    },
    runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
        // Apply a network-first strategy.
        handler: "staleWhileRevalidate",
        options: {
            // Use a custom cache name for this route.
            cacheName: "this-way",
            // Configure custom cache expiration.
            expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60,
            },
            // Configure which responses are considered cacheable.

        },
    }, {
        urlPattern: /^https:\/\/this-way\.s3\.amazonaws\.com\//,
        handler: "staleWhileRevalidate",
        options: {
            cacheName: "this-way",
            expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60,
            }
        }
    }]
};