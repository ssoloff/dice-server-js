/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const correlationId = require('../../../src/server/middleware/correlation-id')

describe('correlationId', () => {
  describe('correlator', () => {
    let correlator
    let next
    let req
    let res

    beforeEach(() => {
      correlator = correlationId()
      next = jasmine.createSpy('next')
      req = {
        get: jasmine.createSpy('get')
      }
      res = {
        set: jasmine.createSpy('set')
      }
    })

    it('should invoke the next middleware in the chain', () => {
      correlator(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    describe('when the request contains a request ID', () => {
      it('should echo the request ID as the correlation ID in the response', () => {
        const requestId = 'the-request-id'
        req.get.and.returnValue(requestId)

        correlator(req, res, next)

        expect(req.get).toHaveBeenCalledWith('X-Request-ID')
        expect(res.set).toHaveBeenCalledWith('X-Correlation-ID', requestId)
      })
    })

    describe('when the request does not contain a request ID', () => {
      it('should not modify the response', () => {
        correlator(req, res, next)

        expect(res.set).not.toHaveBeenCalled()
      })
    })
  })
})
