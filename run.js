/* eslint no-console: 0, no-sync: 0 */
const fs = require('fs');
const del = require('del');
const ejs = require('ejs');
const webpack = require('webpack');
const minify = require('html-minifier').minify;
const firebaseConfig = require('./firebase.config');
const spawn = require('child_process').spawn;

// Configuration settings
let config = {
  title: 'Cother • Collaborative Code Editor', // Website title
  description: 'Cother is a real-time collaborative code editor and previewer.', // Website description
};

config = Object.assign({}, config, firebaseConfig);

global.DEBUG = process.argv.includes('--debug') || false;
global.PUBLIC_FOLDER = 'public';
global.BUILD_FOLDER = 'build';
global.DIST_FOLDER = `${global.BUILD_FOLDER}/dist`;
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
tasks.set('clean', () => del([`${global.BUILD_FOLDER}/*`], { dot: true }));

//
// Copy ./index.html into the /public folder
// -----------------------------------------------------------------------------
tasks.set('html', () => {
  const assets = JSON.parse(fs.readFileSync(`${global.DIST_FOLDER}/assets.json`, 'utf8'));
  const template = fs.readFileSync(`${global.PUBLIC_FOLDER}/index.tmpl.ejs`, 'utf8');
  const render = ejs.compile(template, { filename: `${global.PUBLIC_FOLDER}/index.tmpl.ejs` });
  const output = render({
    debug: global.DEBUG,
    css: {
      main: assets.main.css,
    },
    js: {
      vendor: assets.vendor.js,
      main: assets.main.js,
    },
    timestamp: Math.round(new Date().getTime() / 1000),
    config,
  });
  if (!fs.existsSync(global.BUILD_FOLDER)) {
    fs.mkdirSync(global.BUILD_FOLDER);
  }
  fs.writeFileSync(`${global.BUILD_FOLDER}/index.html`, minify(output, {
    removeComments: true,
    collapseWhitespace: true,
  }), 'utf8');

  // copy favicon
  fs.createReadStream(`${global.PUBLIC_FOLDER}/favicon.png`)
    .pipe(fs.createWriteStream(`${global.BUILD_FOLDER}/favicon.png`));
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
tasks.set('deploy', () => {
  const login = () =>
    new Promise(resolve => {
      const cmd = spawn('./node_modules/.bin/firebase', ['login'], { stdio: 'inherit' });
      cmd.on('close', code => {
        resolve(code);
      });
    });

  const deploy = () =>
    new Promise(resolve => {
      const cmd = spawn('./node_modules/.bin/firebase', ['deploy'], {
        stdio: 'inherit',
      });
      cmd.on('close', code => {
        resolve(code);
      });
    });

  return run('build')
    .then(() => login())
    .then(() => deploy());
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
  return run('clean')
    .then(() => new Promise((resolve) => {
      const bs = require('browser-sync').create();
      const webpackConfig = require('./webpack.config');
      const compiler = webpack(webpackConfig);
      // Node.js middleware that compiles application in watch mode with HMR support
      // http://webpack.github.io/docs/webpack-dev-middleware.html
      const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: webpackConfig.stats,
      });
      compiler.plugin('done', (stats) => {
        // Generate index.html page
        const jsVendor = stats.compilation.chunks.find(x => x.name === 'vendor').files[0];
        const jsMain = stats.compilation.chunks.find(x => x.name === 'main').files[0];
        const template = fs.readFileSync(`${global.PUBLIC_FOLDER}/index.tmpl.ejs`, 'utf8');
        const render = ejs.compile(template, { filename: `${global.PUBLIC_FOLDER}/index.tmpl.ejs` });
        const serveConfig = {
          debug: global.DEBUG,
          css: {
            main: false,
          },
          js: {
            vendor: `/${jsVendor}`,
            main: `/${jsMain}`,
          },
          timestamp: Math.round(new Date().getTime() / 1000),
          config,
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
        fs.writeFileSync(`${global.BUILD_FOLDER}/index.html`, output, 'utf8');

        // Launch Browsersync after the initial bundling is complete
        // For more information visit https://browsersync.io/docs/options
        if (++count === 1) {
          const middleware = [
            webpackDevMiddleware,
            require('webpack-hot-middleware')(compiler),
            require('connect-history-api-fallback')(),
          ];
          if (!global.DEBUG) {
            middleware.splice(1, 1); // remove `webpack-hot-middleware`
          }
          bs.init({
            port: global.PORT,
            ui: { port: Number(global.PORT) + 1 },
            server: {
              baseDir: global.BUILD_FOLDER,
              middleware,
            },
            open: false,
          }, resolve);
        }
      });
    }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
