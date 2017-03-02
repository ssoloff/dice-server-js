/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')
const serviceTest = require('../test-support/service-test')
const serviceUtils = require('../../../src/server/util/service-utils')

describe('serviceUtils', () => {
  describe('.createServiceErrorFromResponse', () => {
    describe('when response body does not contain an error', () => {
      it('should create error with empty message', () => {
        const e = serviceUtils.createServiceErrorFromResponse(httpStatus.INTERNAL_SERVER_ERROR, {})

        expect(e.message).toBe('')
      })
    })
  })

  describe('.getRequestRootUrl', () => {
    const requestHeaders = {
      host: 'hostname:1234'
    }
    let request

    beforeEach(() => {
      request = {
        get: jasmine.createSpy('get').and.callFake((field) => requestHeaders[field.toLowerCase()]),
        protocol: 'http'
      }
    })

    describe('when the request has not been forwarded', () => {
      it('should use the request protocol', () => {
        expect(serviceUtils.getRequestRootUrl(request)).toBe('http://hostname:1234')
      })
    })

    describe('when the request has been forwarded', () => {
      it('should use the forwarded protocol', () => {
        requestHeaders['x-forwarded-proto'] = 'https'

        expect(serviceUtils.getRequestRootUrl(request)).toBe('https://hostname:1234')
      })
    })
  })

  describe('.setFailureResponse', () => {
    describe('when error is not an instance of ServiceError', () => {
      it('should set response status to internal server error', () => {
        const response = serviceTest.createResponse(() => {
        })

        serviceUtils.setFailureResponse(response, new Error('message'))

        expect(response.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR)
      })
    })
  })
})
