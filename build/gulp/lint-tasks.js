/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const change = require('gulp-change')
const csslint = require('gulp-csslint')
const eslint = require('gulp-eslint')
const excludeGitignore = require('gulp-exclude-gitignore')
const gulp = require('gulp')
const gutil = require('gulp-util')
const htmlhint = require('gulp-htmlhint')
const jsonlint = require('gulp-jsonlint')
const paths = require('./paths')
const Transform = require('stream').Transform
const validatePackage = require('gulp-nice-package')

function runEsLint (globs) {
  return gulp.src(globs)
    .pipe(excludeGitignore())
    .pipe(eslint({
      warnFileIgnored: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function runHtmlHint (stream) {
  return stream
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter())
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

gulp.task('lint:css', () => {
  return gulp.src(paths.css.main.client)
    .pipe(csslint())
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'))
})

gulp.task('lint:html:fragment', () => {
  return runHtmlHint(
    gulp.src(paths.html.main.client.fragment)
      .pipe(change(wrapHtmlFragment))
  )
})

gulp.task('lint:html:full', () => {
  return runHtmlHint(
    gulp.src([paths.html.main.client.main, paths.html.main.server])
  )
})

gulp.task('lint:html', ['lint:html:full', 'lint:html:fragment'])

gulp.task('lint:js', () => {
  return runEsLint([paths.js.all, `!${paths.gulpfile}`])
})

gulp.task('lint:json', () => {
  return gulp.src(paths.json.all, {dot: true})
    .pipe(excludeGitignore())
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.failAfterError())
})

gulp.task('lint:package', () => {
  function failOnError () {
    return new Transform({
      objectMode: true,
      transform (file, enc, cb) {
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
      }
    })
  }

  return gulp.src(paths.packageInfo)
    .pipe(validatePackage())
    .pipe(failOnError())
})

gulp.task('lint', ['lint:js', 'lint:json', 'lint:package', 'lint:html', 'lint:css'])
