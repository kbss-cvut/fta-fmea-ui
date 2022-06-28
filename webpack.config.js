"use strict";

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path')

module.exports = env => {
    return {
        // Set debugging source maps to be "inline" for
        // simplicity and ease of use
        devtool: "inline-source-map",

        mode: 'development',

        // The application entry point
        entry: "./src/index.tsx",

        // Where to compile the bundle
        // By default the output directory is `dist`
        output: {
            path: __dirname + '/public',
            filename: "build/bundle.js",
            publicPath: "/"
        },

        devServer: {
            historyApiFallback: true,
            publicPath: "/"
        },

        // Supported file loaders
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                publicPath: 'images',
                                outputPath: 'images'
                            }
                        },
                    ]
                },
            ]
        },

        plugins: [
            new Dotenv({
                path: `./.env.${env.NODE_ENV === "prod" ? "prod" : "dev"}`,
            })
        ],

        // File extensions to support resolving
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            plugins: [new TsconfigPathsPlugin({})],
            alias: {
                'jsonld': path.resolve('./node_modules/jsonld/dist/jsonld.js'),
            }
        }
    }
};