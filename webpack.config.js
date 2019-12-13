const webpack = require('webpack');
const path = require('path');


module.exports = {
    target: "web",
    context: __dirname,
    devtool: "source-map",
    entry: {index: path.resolve(__dirname, 'js/scripts.js')},
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },


    devServer: {
        inline: true,
        hot: true,
        port: 8080,
        publicPath: '/public/',
        contentBase: __dirname,
        watchContentBase: true,
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    }
};