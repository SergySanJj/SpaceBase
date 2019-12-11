var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: "source-map",
    entry: "./js/scripts.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    devServer: {
        inline:true,
        port: 9000
    }
};