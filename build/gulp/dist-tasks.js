/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dirs = require('./dirs')
const eventStream = require('event-stream')
const gulp = require('gulp')
const paths = require('./paths')
const util = require('./util')

gulp.task('dist:client', () => {
  return eventStream.merge(
    gulp.src(util.compilePath(paths.html.main.client.main))
      .pipe(gulp.dest(dirs.htmlDist)),
    gulp.src(util.compilePath(paths.js.main.client.bundle))
      .pipe(gulp.dest(dirs.jsDist))
  )
})

gulp.task('dist:server', () => {
  return gulp.src([util.compilePath(paths.html.main.server), util.compilePath(paths.js.main.server)])
    .pipe(gulp.dest(dirs.dist))
})

gulp.task('dist', ['dist:client', 'dist:server'])
