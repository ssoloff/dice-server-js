/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const enableDestroy = require('server-destroy')
const serviceTest = require('./test-support/service-test')

describe('server', () => {
  let server

  beforeAll((done) => {
    const argv = process.argv
    process.argv = ['node', 'server.js']
    process.env.DSJS_PRIVATE_KEY = serviceTest.getPrivateKey()
    process.env.DSJS_PUBLIC_KEY = serviceTest.getPublicKey()

    require('../../src/server/server').then((_server) => { // eslint-disable-line global-require
      server = _server
      enableDestroy(server)
      done()
    })

    delete process.env.DSJS_PUBLIC_KEY
    delete process.env.DSJS_PRIVATE_KEY
    process.argv = argv
  })

  afterAll((done) => {
    server.destroy(done)
  })

  it('should start successfully', () => {
    expect(server.listening).toBe(true)
  })
})
