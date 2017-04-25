/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const coveralls = require('gulp-coveralls')
const gulp = require('gulp')
const paths = require('./paths')

gulp.task('publish-coverage', () => {
  if (process.env.CI !== 'true') {
    return
  }

  return gulp.src(paths.lcov.info)
    .pipe(coveralls())
})
