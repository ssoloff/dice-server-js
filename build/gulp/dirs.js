/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

module.exports = (() => {
  const FEATURES_DIR = 'features'
  const SRC_DIR = 'src'
  const TEST_DIR = 'test'

  const BUILD_DIR = '.build'

  const DIST_DIR = `${BUILD_DIR}/dist`
  const PUBLIC_DIST_DIR = `${DIST_DIR}/public`

  const NODE_MODULES_DIR = 'node_modules'

  return {
    build: BUILD_DIR,
    clientFeatures: `${FEATURES_DIR}/client`,
    clientSrc: `${SRC_DIR}/client`,
    compile: `${BUILD_DIR}/compile`,
    coverage: `${BUILD_DIR}/coverage`,
    dist: DIST_DIR,
    features: FEATURES_DIR,
    htmlDist: PUBLIC_DIST_DIR,
    jsDist: `${PUBLIC_DIST_DIR}/js`,
    nodeModules: NODE_MODULES_DIR,
    nodeModulesBin: `${NODE_MODULES_DIR}/.bin`,
    serverFeatures: `${FEATURES_DIR}/server`,
    serverSrc: `${SRC_DIR}/server`,
    serverTest: `${TEST_DIR}/server`,
    src: SRC_DIR,
    test: TEST_DIR
  }
})()
