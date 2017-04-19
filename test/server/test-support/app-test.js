/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const createApp = require('../../../src/server/app')
const securityTest = require('./security-test')

/**
 * Provides useful methods for testing a dice server application.
 *
 * @module app-test
 */
module.exports = {
  /**
   * Creates a new application.
   *
   * @returns {Object!} A new application.
   */
  createApplication () {
    return createApp({
      privateKey: securityTest.getPrivateKey(),
      publicKey: securityTest.getPublicKey()
    })
  }
}
