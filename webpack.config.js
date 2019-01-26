import Uglify from "uglifyjs-webpack-plugin";
import webpack from "webpack";
import LiveReloadPlugin from "webpack-livereload-plugin";
import config from "./config/config";

const production = config.nodeEnv === "production";

export default {
    devtool: production ? false : "source-map",
    entry: "./client/index.js",
    mode: "none",
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".jsx"],
    },
    output: {
        path: "/",
        filename: "bundle.js",
    },
    module: {
        rules: [

            {
                use: "babel-loader",
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: true,
                    presets: ["es2015", "react"]
                }
            },
        ]
    },
    plugins: production ? [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')//client variable (SW)
        }),
        new Uglify({
            cache: true,
            parallel: false,
            uglifyOptions: {
                ecma: 8,
                warnings: false,
                output: {
                    comments: false,
                    beautify: false,
                },
            }
        }),
    ] : [new LiveReloadPlugin({port: 8081}),]

};

