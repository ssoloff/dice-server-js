/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const appTest = require('../test-support/app-test')
const middleware = require('../../../src/server/middleware')

describe('middleware', () => {
  it('should not throw an exception when provided a valid application', () => {
    expect(() => {
      middleware({
        app: appTest.createApplication(),
        services: () => undefined
      })
    }).not.toThrow()
  })
})
