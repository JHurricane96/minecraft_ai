'use strict';

let path = require('path');

module.exports = {
    entry: {
        main: path.resolve('./src/main.js')
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve('./public/dist')
    },

    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['env']
    //                 }
    //             }
    //         }
    //     ]
    // }
};
