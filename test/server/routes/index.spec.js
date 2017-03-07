/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const express = require('express')
const routes = require('../../../src/server/routes')
const securityTest = require('../test-support/security-test')

describe('routes', () => {
  it('should not throw an exception when provided a valid application', () => {
    expect(() => {
      const app = express()
      app.locals.privateKey = securityTest.getPrivateKey()
      app.locals.publicKey = securityTest.getPublicKey()
      routes(app)
    }).not.toThrow()
  })
})
