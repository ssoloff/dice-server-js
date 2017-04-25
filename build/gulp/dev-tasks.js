/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const gulp = require('gulp')
const paths = require('./paths')
const runSequence = require('run-sequence')

gulp.task('dev:_rebuild:with-tests', (done) => {
  runSequence('clean', 'test:unit:_without-coverage', 'dist', done)
})

gulp.task('dev:_rebuild:with-tests-and-lint', ['dev:_rebuild:with-tests'], (done) => {
  runSequence('lint', done)
})

gulp.task('dev:_rebuild:without-tests', (done) => {
  runSequence('clean', 'compile', 'dist', done)
})

gulp.task('dev', ['dev:_rebuild:with-tests-and-lint'], () => {
  gulp.watch(
    [paths.all.all, `!${paths.build.all}`, `!${paths.nodeModules.all}`],
    ['dev:_rebuild:with-tests-and-lint']
  )
})
