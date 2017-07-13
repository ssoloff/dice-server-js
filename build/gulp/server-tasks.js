/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const browserSync = require('browser-sync')
const childProcess = require('child_process')
const del = require('del')
const dirs = require('./dirs')
const fs = require('fs')
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const paths = require('./paths')

const SERVER_PID_ENCODING = 'utf8'

gulp.task('server:dev:_browser-sync', ['server:dev:_nodemon'], () => {
  browserSync({
    notify: true,
    port: 5000,
    proxy: 'localhost:3000'
  })
})

gulp.task('server:dev:_nodemon', ['dev:_rebuild:with-tests'], (done) => {
  let called = false
  return nodemon({
    args: [paths.pem.test.server.private, paths.pem.test.server.public],
    ext: 'css html jison js',
    script: paths.serverMain,
    tasks: ['dev:_rebuild:without-tests'],
    watch: [`${dirs.src}/*`]
  })
    .on('start', () => {
      if (!called) {
        called = true
        done()
      }
    })
    .on('restart', () => {
      setTimeout(() => {
        browserSync.reload({
          stream: false
        })
      }, 1000)
    })
})

gulp.task('server:dev', ['server:dev:_browser-sync'])

gulp.task('server:start', (done) => {
  const child = childProcess
    .spawn(
      process.argv[0], [
        paths.serverMain,
        paths.pem.test.server.private,
        paths.pem.test.server.public
      ], {
        detached: true,
        stdio: 'ignore'
      }
    )
    .on('error', done)
  child.unref()

  if (!_.isUndefined(child.pid)) {
    fs.writeFileSync(paths.serverPid, child.pid, {
      encoding: SERVER_PID_ENCODING
    })
  }

  done()
})

gulp.task('server:stop', () => {
  const pid = fs.readFileSync(paths.serverPid, {
    encoding: SERVER_PID_ENCODING
  })
  process.kill(pid)
  return del(paths.serverPid)
})
