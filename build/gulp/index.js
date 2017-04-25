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
const browserify = require('browserify')
const change = require('gulp-change')
const childProcess = require('child_process')
const coveralls = require('gulp-coveralls')
const csslint = require('gulp-csslint')
const del = require('del')
const dirs = require('./dirs')
const eslint = require('gulp-eslint')
const eventStream = require('event-stream')
const excludeGitignore = require('gulp-exclude-gitignore')
const fs = require('fs')
const git = require('git-rev')
const glob = require('glob')
const gulp = require('gulp')
const gutil = require('gulp-util')
const htmlhint = require('gulp-htmlhint')
const istanbul = require('gulp-istanbul')
const jasmine = require('gulp-jasmine')
const jison = require('gulp-jison')
const jsonlint = require('gulp-jsonlint')
const nodemon = require('gulp-nodemon')
const path = require('path')
const paths = require('./paths')
const replace = require('gulp-replace')
const runSequence = require('run-sequence')
const source = require('vinyl-source-stream')
const streamToPromise = require('stream-to-promise')
const through = require('through2')
const validatePackage = require('gulp-nice-package')

const SERVER_PID_ENCODING = 'utf8'

function compilePath (path) {
  let compilePath = dirs.compile
  if (path) {
    compilePath += `/${path}`
  }
  return compilePath
}

function exec (command) {
  return new Promise((resolve, reject) => {
    const child = childProcess.exec(command, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
    child.stdout.on('data', (data) => {
      process.stdout.write(data)
    })
    child.stderr.on('data', (data) => {
      process.stderr.write(data)
    })
  })
}

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

function runCucumber (path) {
  let promise = Promise.resolve()

  const featureDirs = glob.sync(`${path}/*`, {
    ignore: `${path}/support`
  })
  featureDirs.forEach((featureDir) => {
    promise = promise.then(() => exec(`${dirs.nodeModulesBin}/cucumber-js --require ${featureDir} ${featureDir}`))
  })

  return promise
}

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

function runJasmine () {
  return gulp.src(compilePath(paths.js.test.server.spec))
    .pipe(jasmine({
      config: require(`../../${paths.jasmine.config}`), // eslint-disable-line global-require
      verbose: true
    }))
}

function runJsDoc (configPath) {
  return exec(`${dirs.nodeModulesBin}/jsdoc -c ${configPath}`)
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

gulp.task('clean', () => {
  return del(dirs.build)
})

gulp.task('compile:client:html', () => {
  return gulp.src(paths.html.main.client.main, {base: '.'})
    .pipe(gulp.dest(compilePath()))
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
        .pipe(gulp.dest(compilePath(dirs.clientSrc)))
    ))
})

gulp.task('compile:client', ['compile:client:html', 'compile:client:js'])

gulp.task('compile:server:html', () => {
  return gulp.src(paths.html.main.server)
    .pipe(gulp.dest(compilePath(dirs.serverSrc)))
})

gulp.task('compile:server:jison', () => {
  return gulp.src(paths.jison.main.server)
    .pipe(jison())
    .pipe(gulp.dest(compilePath(dirs.serverSrc)))
})

gulp.task('compile:server:js:prod', () => {
  return gulp.src(paths.js.main.server, {base: '.'})
    .pipe(gulp.dest(compilePath()))
})

gulp.task('compile:server:js:test', () => {
  return gulp.src([paths.js.test.server.all, paths.pem.test.server.all], {base: '.'})
    .pipe(gulp.dest(compilePath()))
})

gulp.task('compile:server:js', ['compile:server:js:prod', 'compile:server:js:test'])

gulp.task('compile:server', ['compile:server:html', 'compile:server:jison', 'compile:server:js'])

gulp.task('compile', ['compile:client', 'compile:server'])

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

gulp.task('dist:client', () => {
  return eventStream.merge(
    gulp.src(compilePath(paths.html.main.client.main))
      .pipe(gulp.dest(dirs.htmlDist)),
    gulp.src(compilePath(paths.js.main.client.bundle))
      .pipe(gulp.dest(dirs.jsDist))
  )
})

gulp.task('dist:server', () => {
  return gulp.src([compilePath(paths.html.main.server), compilePath(paths.js.main.server)])
    .pipe(gulp.dest(dirs.dist))
})

gulp.task('dist', ['dist:client', 'dist:server'])

gulp.task('docs:client', () => {
  return runJsDoc(paths.jsdoc.config.client)
})

gulp.task('docs:server', () => {
  return runJsDoc(paths.jsdoc.config.server)
})

gulp.task('docs', ['docs:client', 'docs:server'])

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

  return gulp.src(paths.packageInfo)
    .pipe(validatePackage())
    .pipe(failOnError())
})

gulp.task('lint', ['lint:js', 'lint:json', 'lint:package', 'lint:html', 'lint:css'])

gulp.task('publish-coverage', () => {
  if (process.env.CI !== 'true') {
    return
  }

  return gulp.src(paths.lcov.info)
    .pipe(coveralls())
})

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
      compilePath(paths.js.main.server),
      `!${compilePath(dirs.serverSrc)}/model/dice-expression-parser.js`
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