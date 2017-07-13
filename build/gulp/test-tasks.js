/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dirs = require('./dirs')
const glob = require('glob')
const gulp = require('gulp')
const istanbul = require('gulp-istanbul')
const jasmine = require('gulp-jasmine')
const paths = require('./paths')
const runSequence = require('run-sequence')
const streamToPromise = require('stream-to-promise')
const util = require('./util')

function runCucumber (path) {
  let promise = Promise.resolve()

  const featureDirs = glob.sync(`${path}/*`, {
    ignore: `${path}/support`
  })
  featureDirs.forEach((featureDir) => {
    promise = promise.then(() => util.exec(`${dirs.nodeModulesBin}/cucumber-js --require ${featureDir} ${featureDir}`))
  })

  return promise
}

function runJasmine () {
  return gulp.src(util.compilePath(paths.js.test.server.spec))
    .pipe(jasmine({
      config: require(`../../${paths.jasmine.config}`), // eslint-disable-line global-require
      verbose: true
    }))
}

gulp.task('test:acceptance:client', () => {
  return runCucumber(dirs.clientFeatures)
})

gulp.task('test:acceptance:server', () => {
  return runCucumber(dirs.serverFeatures)
})

gulp.task('test:acceptance', (done) => {
  runSequence('test:acceptance:server', 'test:acceptance:client', done)
})

gulp.task('test:unit:_without-coverage', ['compile'], () => {
  return runJasmine()
})

gulp.task('test:unit', ['compile'], () => {
  return streamToPromise(
    gulp.src([
      util.compilePath(paths.js.main.server),
      `!${util.compilePath(dirs.serverSrc)}/model/dice-expression-parser.js`
    ])
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.hookRequire())
  )
    .then(() => streamToPromise(runJasmine()))
    .then(() => streamToPromise(
      gulp.src([])
        .pipe(istanbul.writeReports({
          dir: dirs.coverage,
          reporters: ['lcov', 'text-summary']
        }))
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: 90
          }
        }))
    ))
})
