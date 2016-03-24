'use strict';
var webpack = require('webpack');
var path = require('path');

var SRC = __dirname + '/src';
var BUILD = __dirname + '/build';

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: ['webpack/hot/dev-server', './bootstrap.js']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: SRC,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.js$/,
                //loader: 'ng-annotate!babel?presets[]=es2015!jshint',
                loader: 'babel?presets[]=es2015',
                exclude: /node_modules|bower_components/
            }
        ]
    }
};
