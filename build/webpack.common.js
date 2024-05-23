const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../config');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
/**
If you have used an automatically imported UI component, please use the following two sentences of code
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
**/
const os = require('os');
const threads = os.cpus().length;

module.exports = () => {
  return {
    context: path.resolve(__dirname, '../'),
    entry: './' + config.build.sysApp + '/main.js', // entry file
    stats: 'errors-warnings', // Only output "errors only" when errors or warnings occur: display logo only when errors occur
    externals: {
      axios: 'axios',
    },
    output: {
      filename: 'assets/js/[name].[chunkhash].js',
      chunkFilename: 'assets/js/[name].[chunkhash].js', // Dynamic import and separation of bundles, such as lodashjs, combined with annotation import (/* webpackChunkName: "lodash" */'lodash'), will be packaged as lodash.bundle.js
      path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
      // The configuration module will parse '.vue','.js','.json', '.css', '.ts', '.mjs', '.less', '.sass','.jsx', '.coffee', '.tsx',
      extensions: [
        '.vue', '.js', '.jsx', '.json', '.css', '.ts', '.tsx', '.mjs', '.less', '.sass',
      ], // Introducing these files allows for sequential parsing without a suffix '.js', '.vue', '.json', '.css'
      alias: {
        '@': path.join(__dirname, '../public'),
        '@utils': path.join(__dirname, '../public/utils'),
        '@App': path.join(__dirname, '../'),
      },
      aliasFields: ['browser', 'browser.esm'] /** alias region **/,
      modules: ['node_modules'], /** Absolute Addressing Path **/
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        }, // It will be applied to regular `. js ` files and ` script>` blocks in `. vue ` files
        {
          test: /\.mjs$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [{
            loader: 'thread-loader', // Enable multiple processes
            options: {
              workers: threads, // number
            },
          },
          {
            loader: 'babel-loader',
            options: {
              //comments: false, Open this sentence without displaying the Chunk name
              presets: ['@babel/preset-env'],
              plugins: [['@babel/plugin-transform-runtime',
                { corejs: 3 }]],
            },
          }],
          type: 'javascript/auto',
        },
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // Only perform language conversion without type checking
            },
          }],
        },
        {
          test: /\.(png|svg|jpg|gif|webp)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 6 * 1024, // Inline processing of images smaller than 6kb
            },
          },
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new VueLoaderPlugin(),
      /** Copy the static folder of the root directory to dist **/
      new CopyWebpackPlugin({
        patterns: [{
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory,
        }],
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      /**
       If you have used an automatically imported UI component, please use the following two sentences of code
       AutoImport.default({ resolvers: [UIResolver()] }), // UIResolver, it is the method provided by your UI framework
       Components.default({ resolvers: [UIResolver()] }), // UIResolver, it is the method provided by your UI framework
       **/
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true), // To avoid console warning messages, do you want to enable the options API? Vue3 has added the setup syntax (recommended).
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // Does the production environment support DEVTOOLS
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  };
};
