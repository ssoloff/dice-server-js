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
const TEST_DIR = 'test';
const COMPILE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/compile`;

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
