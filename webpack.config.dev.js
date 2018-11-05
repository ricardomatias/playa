const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * Webpack Configuration
 */
module.exports = {
	mode: 'development',
	entry: {
		'main': path.resolve(__dirname, 'src/index.js'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	resolve: {
		alias: {
			'playa': path.resolve(__dirname, 'lib'),
			'Interface': path.resolve(__dirname, 'src/vendor/Interface.js'),
			'Waveform': path.resolve(__dirname, 'src/vendor/Waveform.js'),
		},
	},
	target: 'web',
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
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ],
			},
		],
	},
	devServer: {
		contentBase: './dist',
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
	},
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'index.html'),
			title: 'PLAYA',
		}),
		new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
		new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
	],
};
