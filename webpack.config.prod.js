const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/**
 * Webpack Configuration
 */
module.exports = {
	mode: 'production',
	entry: {
		'playa': path.resolve(__dirname, 'playa.js'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		library: 'playa',
		libraryTarget: 'umd',
	},
	resolve: {
		alias: {
			'playa': path.resolve(__dirname, 'lib'),
		},
	},
	target: 'web',
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
	optimization: {
		minimizer: [ new UglifyJsPlugin() ],
	},
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),
		new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
	],
};
