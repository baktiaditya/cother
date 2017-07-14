/* eslint no-console: 0, no-sync: 0 */
const fs = require('fs');
const del = require('del');
const ejs = require('ejs');
const firebase = require('firebase-tools');
const webpack = require('webpack');
const firebaseConfig = require('./firebase.config');

// Configuration settings
const config = {
  title: 'TVLK UIDev Text Editor', // Website title
  url: `https://${firebaseConfig.projectID}.firebaseapp.com` // Website URL
};

global.DEBUG = process.argv.includes('--debug') || false;
global.PUBLIC_FOLDER = 'public';
global.DIST_FOLDER = `${global.PUBLIC_FOLDER}/dist`;
global.PORT = process.env.PORT || 4040;

const tasks = new Map(); // The collection of automation tasks ('clean', 'build', 'publish', etc.)

function run(task) {
  const start = new Date();
  console.log(`Starting ${task}...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`${'\x1b[36m'}Finished ${task} after ${new Date().getTime() - start.getTime()}ms${'\x1b[0m'}`);
    return false;
  }, err => console.error(err.stack));
}

//
// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => del([`${global.DIST_FOLDER}/*`], { dot: true }));

//
// Copy ./index.html into the /public folder
// -----------------------------------------------------------------------------
tasks.set('html', () => {
  const assets = JSON.parse(fs.readFileSync(`${global.DIST_FOLDER}/assets.json`, 'utf8'));
  const template = fs.readFileSync(`${global.PUBLIC_FOLDER}/index.tmpl.ejs`, 'utf8');
  const render = ejs.compile(template, { filename: `${global.PUBLIC_FOLDER}/index.tmpl.ejs` });
  const output = render({
    debug: global.DEBUG,
    bundleCSS: assets.main.css,
    bundleJS: assets.main.js,
    timestamp: Math.round(new Date().getTime() / 1000),
    config
  });
  fs.writeFileSync(`${global.PUBLIC_FOLDER}/index.html`, output, 'utf8');
});

//
// Bundle JavaScript, CSS and image files with Webpack
// -----------------------------------------------------------------------------
tasks.set('bundle', () => new Promise((resolve, reject) => {
  const webpackConfig = require('./webpack.config');
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      reject(err);
    } else {
      console.log(stats.toString(webpackConfig.stats));
      resolve();
    }
  });
}));

//
// Build and publish
// -----------------------------------------------------------------------------
tasks.set('publish', () => {
  return run('build')
  .then(() => firebase.login({ nonInteractive: false }))
  .then(() => firebase.deploy({
    project: firebaseConfig.projectID,
    cwd: __dirname
  }))
  .then(() => console.log(`Deployed to ${config.url}`))
  .then(() => setTimeout(() => process.exit(), 50));
});

//
// Build into a distributable format
// -----------------------------------------------------------------------------
tasks.set('build', () => {
  return Promise.resolve()
  .then(() => run('clean'))
  .then(() => run('bundle'))
  .then(() => run('html'));
});

//
// Build and launch it in a browser for testing (default)
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  let count = 0;
  return run('clean').then(() => new Promise((resolve) => {
    const bs = require('browser-sync').create();
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    // Node.js middleware that compiles application in watch mode with HMR support
    // http://webpack.github.io/docs/webpack-dev-middleware.html
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats
    });
    compiler.plugin('done', (stats) => {
      // Generate index.html page
      const bundleJS = stats.compilation.chunks.find(x => x.name === 'main').files[0];
      const template = fs.readFileSync(`${global.PUBLIC_FOLDER}/index.tmpl.ejs`, 'utf8');
      const render = ejs.compile(template, { filename: `${global.PUBLIC_FOLDER}/index.tmpl.ejs` });
      const serveConfig = {
        debug: global.DEBUG,
        bundleCSS: false,
        bundleJS: `/${bundleJS}`,
        timestamp: Math.round(new Date().getTime() / 1000),
        config
      };
      if (!global.DEBUG) {
        const assets = JSON.parse(fs.readFileSync(`${global.DIST_FOLDER}/assets.json`, 'utf8'));
        serveConfig.bundleJS = assets.main.js;
        serveConfig.bundleCSS = assets.main.css;
      }
      const output = render(serveConfig);
      if (!fs.existsSync(global.DIST_FOLDER)) {
        fs.mkdirSync(global.DIST_FOLDER);
      }
      fs.writeFileSync(`${global.PUBLIC_FOLDER}/index.html`, output, 'utf8');

      // Launch Browsersync after the initial bundling is complete
      // For more information visit https://browsersync.io/docs/options
      if (++count === 1) {
        const middleware = [
          webpackDevMiddleware,
          require('webpack-hot-middleware')(compiler),
          require('connect-history-api-fallback')()
        ];
        if (!global.DEBUG) {
          middleware.splice(1, 1); // remove `webpack-hot-middleware`
        }
        bs.init({
          port: global.PORT,
          ui: { port: Number(global.PORT) + 1 },
          server: {
            baseDir: global.PUBLIC_FOLDER,
            middleware
          },
          open: false
        }, resolve);
      }
    });
  }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
