"use strict";

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require("path");

module.exports = {
    // Set debugging source maps to be "inline" for
    // simplicity and ease of use
    devtool: "inline-source-map",

    mode: 'development',

    // The application entry point
    entry: "./src/index.tsx",

    // Where to compile the bundle
    // By default the output directory is `dist`
    output: {
        filename: "bundle.js"
    },

    // Supported file loaders
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.(s*)css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({filename: 'app.bundle.css'}),
    ],

    // File extensions to support resolving
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
};