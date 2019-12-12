const webpack = require('webpack');
const path = require('path');


module.exports = {
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
        port: 8080
    }
};