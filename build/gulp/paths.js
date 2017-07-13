/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dirs = require('./dirs')

module.exports = {
  all: {
    all: '**/*'
  },
  build: {
    all: `${dirs.build}/**`
  },
  css: {
    main: {
      client: `${dirs.clientSrc}/**/*.css`
    }
  },
  gulpfile: 'gulpfile.js',
  html: {
    main: {
      client: {
        fragment: `${dirs.clientSrc}/*/**/*.html`,
        main: `${dirs.clientSrc}/index.html`
      },
      server: `${dirs.serverSrc}/**/*.html`
    }
  },
  jasmine: {
    config: `${dirs.serverTest}/.jasmine.json`
  },
  jison: {
    main: {
      server: `${dirs.serverSrc}/**/*.jison`
    }
  },
  js: {
    all: '**/*.js',
    main: {
      client: {
        bundle: `${dirs.clientSrc}/bundle.js`,
        main: `${dirs.clientSrc}/index.js`
      },
      server: `${dirs.serverSrc}/**/*.js`
    },
    test: {
      server: {
        all: `${dirs.serverTest}/**/*.js`,
        spec: `${dirs.serverTest}/**/*.spec.js`
      }
    }
  },
  jsdoc: {
    config: {
      client: '.jsdoc-client-conf.json',
      server: '.jsdoc-server-conf.json'
    }
  },
  json: {
    all: '**/*.json'
  },
  lcov: {
    info: `${dirs.coverage}/lcov.info`
  },
  nodeModules: {
    all: `${dirs.nodeModules}/**`
  },
  packageInfo: 'package.json',
  pem: {
    test: {
      server: {
        all: `${dirs.serverTest}/**/*.pem`,
        private: `${dirs.serverTest}/test-keys/private-key.pem`,
        public: `${dirs.serverTest}/test-keys/public-key.pem`
      }
    }
  },
  serverMain: `${dirs.dist}/server.js`,
  serverPid: '.server.pid'
}
