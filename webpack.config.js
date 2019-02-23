const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
let glob = require("glob");
const partialRight = require('lodash/partialRight');

// configure glob to always give us absolute paths (webpack does not like relative paths)
globSync = partialRight(glob.sync, { absolute: true });

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';


//=========================================================
//  Rules
//---------------------------------------------------------
const rules = [
  {
    test: /\.js[x]?$/,
    exclude: [
      /node_modules/,
      /external/
    ],
    loader: 'babel-loader'
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  }
];


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = {
  mode: 'development',
  context: path.join(__dirname, 'src'),

  // entries
  // see: https://github.com/webpack/webpack/issues/370
  entry: {
    // dbdi main (including basic dataProviders)
    main: globSync("src/{,dataProviders/,util/,plugins/}*.js"),

    // firebase
    firebase: globSync("src/firebase/*.js"),

    // nodes
    nodes: globSync("src/nodes/*.js"),

    // react
    react: globSync("src/react/*.js")
  },


  module: {
    rules
  },

  // vendor chunk
  // see: https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
  // optimization
  optimization: {
    splitChunks: {
        cacheGroups: {
            default: false,
            // vendor chunk
            vendor: {
              // name of the chunk
              name: 'vendor',
              // async + async chunks
              chunks: 'all',
              // import file path containing node_modules
              test: /node_modules/,
              // priority
              priority: 20
            },
            // common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
        }
    }
  },


  plugins: [
    // clean before build
    new CleanWebpackPlugin(['dist/**.*']),

    // define global constants
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
  ],


  resolve: {
    extensions: ['.js', '.jsx', 'entities.json'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      //path.resolve(__dirname, './'),
    ],
    alias: {
      src: path.resolve(__dirname, 'src/'),
    }
  },


  output: {
    library: 'dbdi',
    libraryTarget: 'umd',
    path: path.resolve('./dist'),
    publicPath: '/dist',
    filename: '[name].js'
  },


  stats: {
    entrypoints: true
  }
};



//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {

}

//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'source-map';

  config.entry.main.unshift(
    'babel-polyfill'
  );

  //config.plugins.push(new BundleAnalyzerPlugin());
}


//=====================================
//  PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION) {
  //loaders[0].exclude.push(/TestPage\.js$/);

  config.devtool = 'eval';

  //config.entry.vendor = './src/vendor.js';

  // config.plugins.push(
  // );
}


//=====================================
//  TEST
//-------------------------------------
if (ENV_TEST) {
  //config.context = path.join(__dirname, 'src');

  config.devtool = 'inline-source-map';

  //config.entry.vendor = './src/vendor.js';

  // config.plugins.push(
  // );
}

module.exports = config;