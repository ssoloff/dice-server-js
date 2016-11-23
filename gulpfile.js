/* jshint bitwise: true,
          curly: true,
          eqeqeq: true,
          esversion: 6,
          forin: true,
          freeze: true,
          latedef: nofunc,
          noarg: true,
          nocomma: true,
          node: true,
          nonbsp: true,
          nonew: true,
          plusplus: true,
          singleGroups: true,
          strict: true,
          undef: true,
          unused: true
*/

'use strict';

const _ = require('underscore');
const childProcess = require('child_process');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');

const BOWER_COMPONENTS_DIR = 'bower_components';
const BUILD_OUTPUT_DIR = 'build';
const FEATURES_DIR = 'features';
const NODE_MODULES_BIN_DIR = 'node_modules/.bin';
const SRC_DIR = 'src';
const CLIENT_SRC_DIR = `${SRC_DIR}/client`;
const SERVER_SRC_DIR = `${SRC_DIR}/server`;
const TEST_DIR = 'test';
const SERVER_TEST_DIR = `${TEST_DIR}/server`;
const COMPILE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/compile`;
const COVERAGE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/coverage`;
const DIST_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/dist`;

const SERVER_PID = 'server.pid';
const SERVER_PID_ENCODING = 'utf8';

function exec(command, callback) {
  childProcess.exec(command, (err) => {
    if (err) {
      return callback(err);
    }
    callback();
  });
}

function runCucumber(path) {
  const cucumber = require('gulp-cucumber');
  const glob = require('glob');
  const streamToPromise = require('stream-to-promise');

  let promise = Promise.resolve();

  const featureDirs = glob.sync(`${path}/*`, {
    ignore: `${path}/support`,
  });
  featureDirs.forEach((featureDir) => {
    promise = promise.then(() => streamToPromise(gulp.src([`${featureDir}/*.feature`]).pipe(cucumber({}))));
  });

  return promise;
}

function runHtmlHint(stream) {
  const htmlhint = require('gulp-htmlhint');
  return stream
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
}

function execJsDoc(configPath, callback) {
  exec(`${NODE_MODULES_BIN_DIR}/jsdoc -c ${configPath}`, callback);
}

function runJscs(globs, configPath) {
  const jscs = require('gulp-jscs');
  return gulp.src(globs)
    .pipe(jscs({
      configPath: configPath,
    }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
}

function runUnitTests() {
  const jasmine = require('gulp-jasmine');
  return gulp.src('') // Files to process are defined in Jasmine configuration below
    .pipe(jasmine({
      config: require(`./${COMPILE_OUTPUT_DIR}/${SERVER_TEST_DIR}/.jasmine.json`),
    }));
}

function wrapHtmlFragment(content) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>FRAGMENT</title>
    </head>
    <body>
    ${content}
    </body>
    </html>`;
}

gulp.task('acceptance-test:client', () => {
  return runCucumber(`${FEATURES_DIR}/client`);
});

gulp.task('acceptance-test:server', () => {
  return runCucumber(`${FEATURES_DIR}/server`);
});

gulp.task('acceptance-test', (done) => {
  const runSequence = require('run-sequence');
  runSequence('acceptance-test:client', 'acceptance-test:server', done);
});

gulp.task('check:csslint', () => {
  const csslint = require('gulp-csslint');
  return gulp.src(`${CLIENT_SRC_DIR}/**/*.css`)
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'));
});

gulp.task('check:htmlhint:fragment', () => {
  const change = require('gulp-change');
  return runHtmlHint(
    gulp.src(`${CLIENT_SRC_DIR}/*/**/*.html`)
      .pipe(change(wrapHtmlFragment))
  );
});

gulp.task('check:htmlhint:full', () => {
  return runHtmlHint(
    gulp.src(`${CLIENT_SRC_DIR}/index.html`)
  );
});

gulp.task('check:htmlhint', ['check:htmlhint:full', 'check:htmlhint:fragment']);

gulp.task('check:jscs:client', () => {
  return runJscs(`${CLIENT_SRC_DIR}/**/*.js`, '.jscs-client-conf.json');
});

gulp.task('check:jscs:server', () => {
  return runJscs(
    [
      'gulpfile.js',
      `${FEATURES_DIR}/**/*.js`,
      `${SERVER_SRC_DIR}/**/*.js`,
      `${SERVER_TEST_DIR}/**/*.js`,
    ],
    '.jscs-server-conf.json'
  );
});

gulp.task('check:jscs', ['check:jscs:client', 'check:jscs:server']);

gulp.task('check:jshint', () => {
  const jshint = require('gulp-jshint');
  return gulp.src([
      'gulpfile.js',
      `${FEATURES_DIR}/**/*.js`,
      `${SRC_DIR}/**/*.js`,
      `${TEST_DIR}/**/*.js`,
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('check', ['check:jshint', 'check:jscs', 'check:htmlhint', 'check:csslint']);

gulp.task('clean', () => {
  return del([BUILD_OUTPUT_DIR]);
});

gulp.task('compile:jison', () => {
  const jison = require('gulp-jison');
  return gulp.src(`${SRC_DIR}/**/*.jison`)
    .pipe(jison())
    .pipe(gulp.dest(`${COMPILE_OUTPUT_DIR}/${SRC_DIR}`));
});

gulp.task('compile:js', () => {
  return gulp.src([
      `${SRC_DIR}/**/*`,
      `${TEST_DIR}/**/*`,
    ], {
      base: '.',
      dot: true,
    })
    .pipe(gulp.dest(COMPILE_OUTPUT_DIR));
});

gulp.task('compile', ['compile:jison', 'compile:js']);

gulp.task('dist:client', () => {
  const eventStream = require('event-stream');
  const flatten = require('gulp-flatten');
  const rename = require('gulp-rename');
  const PUBLIC_DIR = 'public';
  const HTML_DIR = PUBLIC_DIR;
  const CSS_DIR = `${PUBLIC_DIR}/css`;
  const JS_DIR = `${PUBLIC_DIR}/js`;
  const JS_VENDOR_DIR = `${JS_DIR}/vendor`;

  return eventStream.merge(
    gulp.src(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}/**/*.html`)
      .pipe(flatten())
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${HTML_DIR}`)),
    gulp.src(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}/**/*.css`)
      .pipe(flatten())
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${CSS_DIR}`)),
    gulp.src(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}/**/*.js`)
      .pipe(flatten())
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${JS_DIR}`)),
    gulp.src(`${BOWER_COMPONENTS_DIR}/jcanvas/jcanvas.min.js`)
      .pipe(rename('jcanvas.js'))
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${JS_VENDOR_DIR}`)),
    gulp.src(`${BOWER_COMPONENTS_DIR}/jquery/dist/jquery.min.js`)
      .pipe(rename('jquery.js'))
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${JS_VENDOR_DIR}`)),
    gulp.src(`${BOWER_COMPONENTS_DIR}/jquery.event.gevent/jquery.event.gevent.js`)
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${JS_VENDOR_DIR}`)),
    gulp.src(`${BOWER_COMPONENTS_DIR}/normalize-css/normalize.css`)
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${CSS_DIR}`))
  );
});

gulp.task('dist:server', () => {
  return gulp.src(`${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/**/*.js`)
    .pipe(gulp.dest(DIST_OUTPUT_DIR));
});

gulp.task('dist', ['dist:client', 'dist:server']);

gulp.task('docs:client', (done) => {
  execJsDoc('.jsdoc-client-conf.json', done);
});

gulp.task('docs:server', (done) => {
  execJsDoc('.jsdoc-server-conf.json', done);
});

gulp.task('docs', ['docs:client', 'docs:server']);

gulp.task('instrument-for-coverage', ['compile'], () => {
  const istanbul = require('gulp-istanbul');
  return gulp.src([
      `${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/**/*.js`,
      `!${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/model/dice-expression-parser.js`,
      `${COMPILE_OUTPUT_DIR}/${SERVER_TEST_DIR}/**/*.js`,
    ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('publish-coverage', () => {
  const coveralls = require('gulp-coveralls');
  return gulp.src(`${COVERAGE_OUTPUT_DIR}/lcov.info`)
    .pipe(coveralls());
});

gulp.task('start-server', (done) => {
  const child = childProcess.spawn(
      process.argv[0],
      [
        `${DIST_OUTPUT_DIR}/server.js`,
        `${SERVER_TEST_DIR}/test-keys/private-key.pem`,
        `${SERVER_TEST_DIR}/test-keys/public-key.pem`,
      ],
      {
        detached: true,
        stdio: 'ignore',
      }
    )
    .on('error', done);
  child.unref();

  if (!_.isUndefined(child.pid)) {
    fs.writeFileSync(SERVER_PID, child.pid, {
      encoding: SERVER_PID_ENCODING,
    });
  }

  done();
});

gulp.task('stop-server', () => {
  const pid = fs.readFileSync(SERVER_PID, {
    encoding: SERVER_PID_ENCODING,
  });
  process.kill(pid);
  return del([SERVER_PID]);
});

gulp.task('unit-test', ['compile'], () => {
  return runUnitTests();
});

gulp.task('unit-test-with-coverage', ['instrument-for-coverage'], () => {
  const istanbul = require('gulp-istanbul');
  return runUnitTests()
    .pipe(istanbul.writeReports({
      dir: COVERAGE_OUTPUT_DIR,
      reporters: ['lcov', 'text-summary'],
    }))
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 90,
      },
    }));
});
