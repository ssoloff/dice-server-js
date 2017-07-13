/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dirs = require('./dirs')
const gulp = require('gulp')
const paths = require('./paths')
const util = require('./util')

function runJsDoc (configPath) {
  return util.exec(`${dirs.nodeModulesBin}/jsdoc -c ${configPath}`)
}

gulp.task('docs:client', () => {
  return runJsDoc(paths.jsdoc.config.client)
})

gulp.task('docs:server', () => {
  return runJsDoc(paths.jsdoc.config.server)
})

gulp.task('docs', ['docs:client', 'docs:server'])
