const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        main: path.resolve('./src/main.js')
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
        publicPath: '/dist/'
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
