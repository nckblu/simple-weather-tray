const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

const defaultInclude = [SRC_DIR];

module.exports = {
	entry: SRC_DIR + '/index.js',
	output: {
		path: OUTPUT_DIR,
		publicPath: './',
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
				include: defaultInclude,
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader'],
				}),
				include: defaultInclude,
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader' }],
				include: defaultInclude,
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude,
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude,
			},
		],
	},
	target: 'electron-renderer',
	plugins: [
		new HtmlWebpackPlugin(),
		new ExtractTextPlugin('bundle.css'),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		// TODO: Investigate minification mem alloc problem
		// new BabiliPlugin(),
		// new BabiliPlugin({
		// 	// comments: false,
		// 	// minified: true,
		// 	// comments: false,
		// 	// plugins: ['minify-dead-code-elimination', 'minify-mangle-names', 'minify-simplify'],
		// }),
	],
	stats: {
		colors: true,
		children: false,
		chunks: false,
		modules: false,
	},
};
