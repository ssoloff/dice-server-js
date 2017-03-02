/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')
const ja = require('json-assert')
const serviceTest = require('../test-support/service-test')

describe('validateRedeemedTicket', () => {
  let request,
    response,
    responseBody,
    service

  function createValidateRedeemedTicketService () {
    return require('../../../src/server/services/validate-redeemed-ticket')({
      publicKey: serviceTest.getPublicKey()
    })
  }

  function modifyRequestBody (callback) {
    modifyRequestBodyWithoutSignatureUpdate(callback)

    const redeemedTicket = request.body.redeemedTicket
    redeemedTicket.signature = serviceTest.createSignature(redeemedTicket.content)
  }

  function modifyRequestBodyWithoutSignatureUpdate (callback) {
    callback()
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(serviceTest.isResponseBodyEqual)

    request = serviceTest.createRequest()
    modifyRequestBody(() => {
      request.body = {
        redeemedTicket: {
          content: {
            description: 'description',
            evaluateExpressionResponseBody: {
              expression: {
                canonicalText: 'sum(roll(3, d6)) + 4',
                text: '3d6+4'
              },
              expressionResult: {
                text: '[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4',
                value: 22
              },
              randomNumberGenerator: {
                name: 'constantMax'
              }
            },
            id: '00112233445566778899aabbccddeeff00112233',
            validateUrl: 'http://host:1234/validateRedeemedTicketPath'
          },
          signature: null
        }
      }
    })

    response = serviceTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    service = createValidateRedeemedTicketService()
  })

  describe('when redeemed ticket is valid', () => {
    it('should respond with OK', () => {
      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual({})
    })
  })

  describe('when redeemed ticket has an invalid signature', () => {
    it('should respond with bad request error', () => {
      modifyRequestBodyWithoutSignatureUpdate(() => {
        request.body.redeemedTicket.content.description += '...' // Simulate forged content
      })

      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
      expect(responseBody).toEqual({
        error: {
          message: ja.matchType('string')
        }
      })
    })
  })
})
