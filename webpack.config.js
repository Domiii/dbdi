const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let glob = require("glob");
const partialRight = require('lodash/partialRight');
const zipObject = require('lodash/zipObject')

//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';


let outputPath;

if (ENV_TEST) {
  outputPath = 'dist_test';
}
else {
  outputPath = 'dist';
}

// configure glob to always give us absolute paths (webpack does not like relative paths)
globSync = partialRight(glob.sync, { absolute: true });

//=========================================================
//  Rules
//---------------------------------------------------------
const rules = [
  {
    test: /\.js[x]?$/,
    exclude: [
      /node_modules/,
      /external/,
      /.*\/__tests__\/.*/
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
    //index: globSync("src/{,dataProviders/,util/,plugins/}*.js"),
    index: 'src/index.js',

    util: ['./dataAccessUtil'],

    // firebase
    //dbdiFirebase: globSync("src/firebase/*.js"),
    FirebaseDataProvider: 'src/firebase/FirebaseDataProvider.js',

    'firebase-util': 'src/firebase/firebase-util.js',

    // react
    react: 'src/react/index.js'
  },

  externals : {
    react: 'react',
    firebase: 'firebase',
    'firebase/app': 'firebase/app',
    'firebase/auth': 'firebase/auth',
    'firebase/database': 'firebase/database',
    'prop-types': 'prop-types',
    'react-dom': 'react-dom',
    lodash : {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // global variable
    }
  },

  module: {
    rules
  },

  // vendor chunk
  // see: https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
  // optimization
  optimization: {
    minimize: true,
    splitChunks: {
        cacheGroups: {
            default: false,
            // vendor chunk
            // see: https://github.com/webpack/webpack/issues/6647
            // _vendor: {
            //   test: /node_modules/, // you may add "vendor.js" here if you want to
            //   name: "_vendor",
            //   chunks: "initial",
            //   enforce: false
            // }
        }
    }
  },

  plugins: [
    // clean before build
    new CleanWebpackPlugin([`${outputPath}/**.*`]),

    // define global constants
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),

    // // copy package.json to `dist`, so we can just reference that directory and have separate file imports work.
    // // see: https://stackoverflow.com/questions/51796591/allow-direct-import-of-files-within-npm-module-like-lodash
    // new CopyPlugin([
    //   { from: '../package.json', to: 'package.json' }
    // ])
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
    path: path.resolve(`./${outputPath}`),
    publicPath: `/${outputPath}`,
    filename: '[name].js'
  },


  stats: {
    entrypoints: true
  }
};

// add each node as its own entry
const nodeFiles = globSync('src/nodes/*.js').map(fpath => path.basename(fpath, path.extname(fpath)));
Object.assign(config.entry, zipObject(
  nodeFiles,
  nodeFiles.map(fname => `src/nodes/${fname}.js`)
));



//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {

}

// config.entry.main.unshift(
//   '@babel/polyfill'
// );

//=====================================
//  DEVELOPMENT
//-------------------------------------
if (ENV_DEVELOPMENT) {
  config.devtool = 'source-map';

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

  // don't build as library for testing
  delete config.output.library;
  delete config.output.libraryTarget;

  // also: add the node_modules, so we can actually run this!
  config.rules[0].exclude.splice(0, 1);

  //config.entry.vendor = './src/vendor.js';

  // config.plugins.push(
  // );
}

module.exports = config;