const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');

const isDebug = global.DEBUG;
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: isDebug
});

const postcssPlugins = [
  autoprefixer({
    browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
  }),
  require('postcss-flexibility')
];

const cssModuleParam = isModule => ({
  sourceMap: isDebug,
  modules: isModule,
  localIdentName: isDebug ? '[name]_[local]' : '[hash:base64]',
  minimize: !isDebug
});

const cssLoader = {
  test: /\.css$/,
  exclude: /\.mod\.css/
};

const cssModLoader = {
  test: /\.mod\.css?$/
};

const scssLoader = {
  test: /\.scss$/,
  exclude: /\.mod\.scss$/
};

const scssModLoader = {
  test: /\.mod\.scss$/
};

if (isDebug) {
  cssLoader.use = [
    'style-loader',
    { loader: 'css-loader', options: cssModuleParam(false) },
    { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
  ];
  cssModLoader.use = [
    'style-loader',
    { loader: 'css-loader', options: cssModuleParam(true) },
    { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
  ];
  scssLoader.use = [
    'style-loader',
    { loader: 'css-loader', options: cssModuleParam(false) },
    { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } },
    'sass-loader'
  ];
  scssModLoader.use = [
    'style-loader',
    { loader: 'css-loader', options: cssModuleParam(true) },
    { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } },
    'sass-loader'
  ];
} else {
  cssLoader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: Object.assign({}, cssModuleParam(false), { importLoaders: 1 })
      },
      { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
    ]
  });
  cssModLoader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: Object.assign({}, cssModuleParam(true), { importLoaders: 1 })
      },
      { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
    ]
  });
  scssLoader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: Object.assign({}, cssModuleParam(false), { importLoaders: 2 })
      },
      { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } },
      'sass-loader'
    ]
  });
  scssModLoader.use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: Object.assign({}, cssModuleParam(true), { importLoaders: 2 })
      },
      { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } },
      'sass-loader'
    ]
  });
}

const config = {
  entry: {
    main: [
      'es6-promise',
      './src/index'
    ]
  },
  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'cheap-module-eval-source-map' : false,
  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: true,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose
  },
  plugins: [
    new AssetsPlugin({
      path: path.resolve(__dirname, global.DIST_FOLDER),
      filename: 'assets.json',
      prettyPrint: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDebug ? JSON.stringify('development') : JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [`babel-loader?${JSON.stringify(babelConfig)}`],
        include: __dirname,
        exclude: /(node_modules|bower_components)/
      },
      cssLoader,
      cssModLoader,
      scssLoader,
      scssModLoader,
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|csv)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'media/[hash].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|ogg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'media/[hash].[ext]'
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, global.DIST_FOLDER),
    publicPath: isDebug ? `http://localhost:${global.PORT}/` : '/dist/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  '
  }
};

if (isDebug) {
  // Development mode
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.main.unshift(
    'react-hot-loader/patch',
    'webpack-hot-middleware/client'
  );
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  // Optimize the bundle in release (production) mode
  config.plugins.push(new ExtractTextPlugin({
    filename: '[name].[hash].css',
    allChunks: true
  }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: isVerbose } }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// eslint-disable-next-line no-console
console.log(`=> ${isDebug ? '`development`' : '`production`'} env`);

module.exports = config;
