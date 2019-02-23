const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require("glob");


console.log(glob.sync("./src/*.js"));

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
  // entries
  // see: https://github.com/webpack/webpack/issues/370
  entry: {
    // all the things we want to build (and the files that they relate to)
    main: glob.sync("./src/*.js")
  },
  module: {
    rules
  },
  plugins: [
    // clean before build
    new CleanWebpackPlugin(['**.*']),

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
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/dist'
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

  config.entry.vendor = './src/vendor.js';

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