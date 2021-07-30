const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var mode = process.env.NODE_ENV || 'development';
  

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    mode: mode,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        historyApiFallback: true,
        // historyApiFallback: {
        //     index: 'index.html'
        // },
        port: 8080,
        hot: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: 'src/index.html' }],
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                use: {loader: 'ts-loader'},
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
            test: /\.html$/i,
            loader: 'html-loader',
            },
        ],
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.sass',
            '.css',
        ],
    },
};

module.exports = config;