/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const browserify = require('browserify')
const dirs = require('./dirs')
const git = require('git-rev')
const gulp = require('gulp')
const jison = require('gulp-jison')
const path = require('path')
const paths = require('./paths')
const replace = require('gulp-replace')
const source = require('vinyl-source-stream')
const streamToPromise = require('stream-to-promise')
const util = require('./util')

function getGitInfo () {
  return Promise.all([
    promisifyWithoutError(git.branch),
    promisifyWithoutError(git.short)
  ])
  .then(([branch, commit]) => {
    return {
      branch,
      commit
    }
  })
}

function getLocalVersionQualifier (gitInfo) {
  return `local-${gitInfo.branch}-${gitInfo.commit}`
}

function getTravisVersionQualifier () {
  return `travis-${process.env.TRAVIS_BRANCH}-${process.env.TRAVIS_BUILD_NUMBER}`
}

function getVersionQualifier (gitInfo) {
  if (process.env.TRAVIS === 'true') {
    return getTravisVersionQualifier()
  }

  return getLocalVersionQualifier(gitInfo)
}

function injectCopyright () {
  const buildDate = new Date()
  return replace('{{COPYRIGHT_YEAR}}', buildDate.getUTCFullYear())
}

function injectVersion (gitInfo) {
  const packageInfo = require(`../../${paths.packageInfo}`) // eslint-disable-line global-require
  const versionQualifier = getVersionQualifier(gitInfo)
  return replace('{{VERSION}}', `${packageInfo.version}-${versionQualifier}`)
}

function promisifyWithoutError (func) {
  return new Promise((resolve, reject) => {
    func((result) => {
      resolve(result)
    })
  })
}

gulp.task('compile:client:html', () => {
  return gulp.src(paths.html.main.client.main, {base: '.'})
    .pipe(gulp.dest(util.compilePath()))
})

gulp.task('compile:client:js', () => {
  return getGitInfo()
    .then((gitInfo) => streamToPromise(
      browserify([paths.js.main.client.main])
        .transform('browserify-css')
        .transform('brfs')
        .bundle()
        .pipe(source(path.basename(paths.js.main.client.bundle)))
        .pipe(injectVersion(gitInfo))
        .pipe(injectCopyright())
        .pipe(gulp.dest(util.compilePath(dirs.clientSrc)))
    ))
})

gulp.task('compile:client', ['compile:client:html', 'compile:client:js'])

gulp.task('compile:server:html', () => {
  return gulp.src(paths.html.main.server)
    .pipe(gulp.dest(util.compilePath(dirs.serverSrc)))
})

gulp.task('compile:server:jison', () => {
  return gulp.src(paths.jison.main.server)
    .pipe(jison())
    .pipe(gulp.dest(util.compilePath(dirs.serverSrc)))
})

gulp.task('compile:server:js:prod', () => {
  return gulp.src(paths.js.main.server, {base: '.'})
    .pipe(gulp.dest(util.compilePath()))
})

gulp.task('compile:server:js:test', () => {
  return gulp.src([paths.js.test.server.all, paths.pem.test.server.all], {base: '.'})
    .pipe(gulp.dest(util.compilePath()))
})

gulp.task('compile:server:js', ['compile:server:js:prod', 'compile:server:js:test'])

gulp.task('compile:server', ['compile:server:html', 'compile:server:jison', 'compile:server:js'])

gulp.task('compile', ['compile:client', 'compile:server'])
