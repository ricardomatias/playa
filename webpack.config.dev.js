const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Webpack Configuration
 */
module.exports = {
	mode: 'development',
	entry: {
		'main': path.resolve(__dirname, 'index.js'),
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'playa.js',
	},
	resolve: {
		alias: {
			'playa': path.resolve(__dirname, 'lib'),
		},
	},
	target: 'node',
	devtool: 'source-map',
	performance: {
		hints: false,
	},
	module: {
		rules: [
			// BABEL
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
				options: {
					compact: true, // what is this for?
					presets: [ '@babel/preset-env' ],
				},
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin([ 'build' ]),
	],
};
