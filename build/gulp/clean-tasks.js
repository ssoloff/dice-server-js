/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const del = require('del')
const dirs = require('./dirs')
const gulp = require('gulp')

gulp.task('clean', () => {
  return del(dirs.build)
})
