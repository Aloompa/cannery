const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
    	'webpack-babel-project-boilerplate': './src'
    },
    output: {
    	path: path.resolve(__dirname) + '/dist',
    	filename: '[name].js',
    	sourceMapFilename: '[name].map'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: /src/,
            query: {
                presets: ['es2015', 'stage-0']
            }
        }]
    },
    plugings: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};
