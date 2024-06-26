const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const ManifestPlugin = require('webpack-manifest-plugin');
const envConfig = require('../config/env.conf');
const { VueLoaderPlugin } = require('vue-loader');
const BuildENV = envConfig.getBuildENV({
  NODE_ENV: '"production"',
  prod: '"uat"',
});

module.exports = (RESETENV) => {
  /** Define settings **/
  let BuildConfig = {
    /** Packaging application mode **/
    target: 'web',
    /** Packaging mode **/
    mode: 'production',
    /** DevTools enable flag **/
    // devtool:'source-map', // Enabling will generate a map file
    output: {
      path: path.resolve(__dirname, `../dist/${BuildENV.sysApp}/${BuildENV.dist}`),
      publicPath: BuildENV.staticURL,
    },
    plugins: [
      /** Empty dist app folder **/
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      /**定义APP常量**/
      new HtmlWebpackPlugin({
        template: './' + BuildENV.sysApp + '/' + BuildENV.filename,
        filename: 'index.html', // Output file name
        title: BuildENV.title,
        inject: true,
        timeStamp: new Date().valueOf(),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        vConsole: true,
        prod: true,
        staticURL: BuildENV.staticURL,
        webURL: BuildENV.webURL,
        overlay: false, // Display full screen overlay in the browser when compilation errors or warnings occur
      }),
      new webpack.DefinePlugin({
        /** Customize current system variables **/
        'process.env': envConfig.getNodeENV({
          NODE_ENV: '"production"',
          prod: '"uat"',
        }),
        /** Default System Variable **/
        'process.env.NODE_ENV': BuildENV.NODE_ENV,
      }),
      /** Extract CSS **/
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].style.[chunkhash].css', // The name of the style file generated by packaging
        chunkFilename: 'assets/css/[name].[chunkhash].css', // The name of the style file generated by packaging
        ignoreOrder: true,
      }),
      /** Packaging progress settings **/
      new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        handler(percentage, message, ...args) {
          console.info(
            `\u001b[A\u001b[K\u001b[33m${(percentage * 100).toFixed(2)}%` +
                        `\t\u001b[0m\u001b[1m${message}\t` +
                        `\u001b[0m\u001b[90m${
                          args && args.length > 0 ? args[0] : ''
                        }\u001b[0m`,
          );
        },
        modules: true,
        modulesCount: 5000,
        profile: false,
        dependencies: true,
        dependenciesCount: 10000,
        percentBy: null,
      }),
    ],
    /** module **/
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: path.resolve(__dirname, '../build/clearConsole.js'),
      },
      {
        //The execution order of the parser is from bottom to top (CSS loader first, then style loader)
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: {
                auto: false, // Module switch, disable class hash naming in mobile multi page mode
                localIdentName: '[local]_[hash:base64:8]', // Custom generated class name
              },
            },
          }],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      }],
    },
    optimization: {
      minimize: true, // Can be omitted, default optimal configuration: production environment, compression true. Development environment, do not compress false
      minimizer: [new TerserPlugin({
        parallel: true, // Can be omitted, multi-threaded, default to enabling parallelism
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          ecma: 5, // Specify one of: 5, 2015, 2016, etc. This sentence is enabled, and other settings for ecma options are invalid
          parse: {
            'html5_comments': false,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            'drop_debugger': true,
            //'drop_console': true, // console, Based on your situation, decide whether to enable it or not
            //'pure_funcs': ['console.log', 'console.error'], // Remove console, Based on your situation, decide whether to enable it or not
          },
          mangle: {
            safari10: true, // Pass true to resolve Safari 10 loop iterator error 'cannot declare let variable twice'
          },
          output: {
            ecma: 5,
            comments: false,
            'ascii_only': true,
            'inline_script': false,
          },
          ie8: true,
          safari10: true,
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(), // Compress CSS
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  if (BuildENV && BuildENV.analyzer) {
    BuildConfig.plugins.push(new BundleAnalyzerPlugin()); // Packaging volume analysis
    //BuildConfig.plugins.push(new ManifestPlugin());  // Show the mapping relationship between source code and packaged code
  }

  return merge(common(RESETENV), BuildConfig); // Merge Configuration
};
