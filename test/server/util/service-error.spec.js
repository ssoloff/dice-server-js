/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const ServiceError = require('../../../src/server/util/service-error')

describe('ServiceError', () => {
  describe('.constructor', () => {
    it('should use a default message if one is not provided', () => {
      const error = new ServiceError(200, null)

      expect(error.message).not.toBeNull()
    })

    it('should use a default status if one is not provided', () => {
      const error = new ServiceError(null, 'message')

      expect(error.status).not.toBeNull()
    })

    it('should provide a stack trace', () => {
      const error = new ServiceError(200, 'message')

      expect(error.stack).not.toBeUndefined()
    })
  })
})
