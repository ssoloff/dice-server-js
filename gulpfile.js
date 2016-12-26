/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const childProcess = require('child_process')
const del = require('del')
const fs = require('fs')
const gulp = require('gulp')
const runSequence = require('run-sequence')

const BUILD_OUTPUT_DIR = 'build'
const FEATURES_DIR = 'features'
const NODE_MODULES_BIN_DIR = 'node_modules/.bin'
const SRC_DIR = 'src'
const CLIENT_SRC_DIR = `${SRC_DIR}/client`
const SERVER_SRC_DIR = `${SRC_DIR}/server`
const TEST_DIR = 'test'
const SERVER_TEST_DIR = `${TEST_DIR}/server`
const COMPILE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/compile`
const COVERAGE_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/coverage`
const DIST_OUTPUT_DIR = `${BUILD_OUTPUT_DIR}/dist`

const SERVER_PID = 'server.pid'
const SERVER_PID_ENCODING = 'utf8'

function exec (command, callback) {
  childProcess.exec(command, (err) => {
    if (err) {
      return callback(err)
    }
    callback()
  })
}

function runCucumber (path) {
  const cucumber = require('gulp-cucumber')
  const glob = require('glob')
  const streamToPromise = require('stream-to-promise')

  let promise = Promise.resolve()

  const featureDirs = glob.sync(`${path}/*`, {
    ignore: `${path}/support`
  })
  featureDirs.forEach((featureDir) => {
    promise = promise.then(() => streamToPromise(gulp.src([`${featureDir}/*.feature`]).pipe(cucumber({}))))
  })

  return promise
}

function runEsLint (globs, configPath) {
  const eslint = require('gulp-eslint')
  return gulp.src(globs)
    .pipe(eslint({
      configFile: configPath,
      warnFileIgnored: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function runHtmlHint (stream) {
  const htmlhint = require('gulp-htmlhint')
  return stream
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter())
}

function runJsDoc (configPath, callback) {
  exec(`${NODE_MODULES_BIN_DIR}/jsdoc -c ${configPath}`, callback)
}

function runUnitTests () {
  const jasmine = require('gulp-jasmine')
  return gulp.src(`${COMPILE_OUTPUT_DIR}/${SERVER_TEST_DIR}/**/*spec.js`)
    .pipe(jasmine({
      config: require(`./${SERVER_TEST_DIR}/.jasmine.json`)
    }))
}

function wrapHtmlFragment (content) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>FRAGMENT</title>
    </head>
    <body>
    ${content}
    </body>
    </html>`
}

gulp.task('acceptance-test:client', () => {
  return runCucumber(`${FEATURES_DIR}/client`)
})

gulp.task('acceptance-test:server', () => {
  return runCucumber(`${FEATURES_DIR}/server`)
})

gulp.task('acceptance-test', (done) => {
  runSequence('acceptance-test:server', 'acceptance-test:client', done)
})

gulp.task('clean', () => {
  return del([BUILD_OUTPUT_DIR])
})

gulp.task('compile:client:html', () => {
  return gulp.src(`${CLIENT_SRC_DIR}/index.html`, {base: '.'})
    .pipe(gulp.dest(COMPILE_OUTPUT_DIR))
})

gulp.task('compile:client:js', () => {
  const browserify = require('browserify')
  const glob = require('glob')
  const source = require('vinyl-source-stream')
  return browserify(glob.sync(`${CLIENT_SRC_DIR}/**/*.js`))
    .transform('browserify-css')
    .transform('brfs')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}`))
})

gulp.task('compile:client', ['compile:client:html', 'compile:client:js'])

gulp.task('compile:server:jison', () => {
  const jison = require('gulp-jison')
  return gulp.src(`${SRC_DIR}/**/*.jison`)
    .pipe(jison())
    .pipe(gulp.dest(`${COMPILE_OUTPUT_DIR}/${SRC_DIR}`))
})

gulp.task('compile:server:js:prod', () => {
  return gulp.src(`${SERVER_SRC_DIR}/**/*.js`, {base: '.'})
    .pipe(gulp.dest(COMPILE_OUTPUT_DIR))
})

gulp.task('compile:server:js:test', () => {
  return gulp.src(`${SERVER_TEST_DIR}/**/*.{js,pem}`, {base: '.'})
    .pipe(gulp.dest(COMPILE_OUTPUT_DIR))
})

gulp.task('compile:server:js', ['compile:server:js:prod', 'compile:server:js:test'])

gulp.task('compile:server', ['compile:server:jison', 'compile:server:js'])

gulp.task('compile', ['compile:client', 'compile:server'])

gulp.task('dev:_rebuild:with-tests', (done) => {
  runSequence('clean', 'unit-test', 'dist', done)
})

gulp.task('dev:_rebuild:without-tests', (done) => {
  runSequence('clean', 'compile', 'dist', done)
})

gulp.task('dev', ['dev:_rebuild:with-tests', 'lint'], () => {
  gulp.watch([`${SRC_DIR}/**/*`, `${TEST_DIR}/**/*`], ['dev:_rebuild:with-tests'])
  gulp.watch(['gulpfile.js', `${FEATURES_DIR}/**/*`, `${SRC_DIR}/**/*`, `${TEST_DIR}/**/*`], ['lint'])
})

gulp.task('dist:client', () => {
  const eventStream = require('event-stream')
  const PUBLIC_DIR = 'public'
  const HTML_DIR = PUBLIC_DIR
  const JS_DIR = `${PUBLIC_DIR}/js`

  return eventStream.merge(
    gulp.src(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}/index.html`)
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${HTML_DIR}`)),
    gulp.src(`${COMPILE_OUTPUT_DIR}/${CLIENT_SRC_DIR}/bundle.js`)
      .pipe(gulp.dest(`${DIST_OUTPUT_DIR}/${JS_DIR}`))
  )
})

gulp.task('dist:server', () => {
  return gulp.src(`${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/**/*.js`)
    .pipe(gulp.dest(DIST_OUTPUT_DIR))
})

gulp.task('dist', ['dist:client', 'dist:server'])

gulp.task('docs:client', (done) => {
  runJsDoc('.jsdoc-client-conf.json', done)
})

gulp.task('docs:server', (done) => {
  runJsDoc('.jsdoc-server-conf.json', done)
})

gulp.task('docs', ['docs:client', 'docs:server'])

gulp.task('instrument-for-coverage', ['compile'], () => {
  const istanbul = require('gulp-istanbul')
  return gulp
    .src([
      `${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/**/*.js`,
      `!${COMPILE_OUTPUT_DIR}/${SERVER_SRC_DIR}/model/dice-expression-parser.js`,
      `${COMPILE_OUTPUT_DIR}/${SERVER_TEST_DIR}/**/*.js`
    ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
})

gulp.task('lint:css', () => {
  const csslint = require('gulp-csslint')
  return gulp.src(`${CLIENT_SRC_DIR}/**/*.css`)
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'))
})

gulp.task('lint:html:fragment', () => {
  const change = require('gulp-change')
  return runHtmlHint(
    gulp.src(`${CLIENT_SRC_DIR}/*/**/*.html`)
      .pipe(change(wrapHtmlFragment))
  )
})

gulp.task('lint:html:full', () => {
  return runHtmlHint(
    gulp.src(`${CLIENT_SRC_DIR}/index.html`)
  )
})

gulp.task('lint:html', ['lint:html:full', 'lint:html:fragment'])

gulp.task('lint:js:default', () => {
  return runEsLint([
    `${FEATURES_DIR}/**/*.js`,
    `${SRC_DIR}/**/*.js`,
    `${TEST_DIR}/**/*.js`
  ])
})

gulp.task('lint:js:gulpfile', () => {
  return runEsLint('gulpfile.js', '.eslintrc-gulpfile.json')
})

gulp.task('lint:js', ['lint:js:default', 'lint:js:gulpfile'])

gulp.task('lint:json', () => {
  const jsonlint = require('gulp-jsonlint')
  return gulp
    .src(
      ['./*.json', `${FEATURES_DIR}/**/*.json`, `${SRC_DIR}/**/*.json`, `${TEST_DIR}/**/*.json`],
      {dot: true}
    )
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.failAfterError())
})

gulp.task('lint:package', () => {
  const gutil = require('gulp-util')
  const through = require('through2')
  const validate = require('gulp-nice-package')

  function failOnError () {
    return through.obj((file, enc, cb) => {
      let error = null
      if (file.nicePackage.valid === false) {
        error = new gutil.PluginError(
          'gulp-nice-package',
          `Failed with ${_.size(file.nicePackage.errors)} error(s), ` +
              `${_.size(file.nicePackage.warnings)} warning(s), ` +
              `${_.size(file.nicePackage.recommendations)} recommendation(s)`
        )
      }
      return cb(error, file)
    })
  }

  return gulp.src('package.json')
    .pipe(validate())
    .pipe(failOnError())
})

gulp.task('lint', ['lint:js', 'lint:json', 'lint:package', 'lint:html', 'lint:css'])

gulp.task('publish-coverage', () => {
  const coveralls = require('gulp-coveralls')
  return gulp.src(`${COVERAGE_OUTPUT_DIR}/lcov.info`)
    .pipe(coveralls())
})

gulp.task('server:dev', ['dev:_rebuild:with-tests'], () => {
  const nodemon = require('gulp-nodemon')
  nodemon({
    args: [`${SERVER_TEST_DIR}/test-keys/private-key.pem`, `${SERVER_TEST_DIR}/test-keys/public-key.pem`],
    ext: 'jison js',
    script: `${DIST_OUTPUT_DIR}/server.js`,
    tasks: ['dev:_rebuild:without-tests'],
    watch: [`${SERVER_SRC_DIR}/*`]
  })
})

gulp.task('server:start', (done) => {
  const child = childProcess
    .spawn(
      process.argv[0], [
        `${DIST_OUTPUT_DIR}/server.js`,
        `${SERVER_TEST_DIR}/test-keys/private-key.pem`,
        `${SERVER_TEST_DIR}/test-keys/public-key.pem`
      ], {
        detached: true,
        stdio: 'ignore'
      }
    )
    .on('error', done)
  child.unref()

  if (!_.isUndefined(child.pid)) {
    fs.writeFileSync(SERVER_PID, child.pid, {
      encoding: SERVER_PID_ENCODING
    })
  }

  done()
})

gulp.task('server:stop', () => {
  const pid = fs.readFileSync(SERVER_PID, {
    encoding: SERVER_PID_ENCODING
  })
  process.kill(pid)
  return del([SERVER_PID])
})

gulp.task('unit-test', ['compile'], () => {
  return runUnitTests()
})

gulp.task('unit-test-with-coverage', ['instrument-for-coverage'], () => {
  const istanbul = require('gulp-istanbul')
  return runUnitTests()
    .pipe(istanbul.writeReports({
      dir: COVERAGE_OUTPUT_DIR,
      reporters: ['lcov', 'text-summary']
    }))
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 90
      }
    }))
})
