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

const gulp = require('gulp');

const BUILD_OUTPUT_DIR = 'build';
const NODE_MODULES_BIN_DIR = 'node_modules/.bin';
const SRC_DIR = 'src';
const SERVER_SRC_DIR = `${SRC_DIR}/server`;
const TEST_DIR = 'test';
const SERVER_TEST_DIR = `${TEST_DIR}/server`;
const COMPILE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/compile`;
const COVERAGE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/coverage`;

function exec(command, callback) {
  require('child_process').exec(command, (err) => {
    if (err) {
      return callback(err);
    }
    callback();
  });
}

function execJsDoc(configPath, callback) {
  exec(`${NODE_MODULES_BIN_DIR}/jsdoc -c ${configPath}`, callback);
}

function runUnitTests() {
  const jasmine = require('gulp-jasmine');
  return gulp.src('') // Files to process are defined in Jasmine configuration below
    .pipe(jasmine({
      config: require(`./${COMPILE_OUTPUT_DIR}/${SERVER_TEST_DIR}/.jasmine.json`),
    }));
}

gulp.task('clean', () => {
  const del = require('del');
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
