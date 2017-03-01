/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const controllerTest = require('../test-support/controller-test')
const httpStatus = require('http-status-codes')
const ja = require('json-assert')

describe('validateRedeemedTicketController', () => {
  let controller,
    request,
    response,
    responseBody

  function createValidateRedeemedTicketController () {
    return require('../../../src/server/services/validate-redeemed-ticket')({
      publicKey: controllerTest.getPublicKey()
    })
  }

  function modifyRequestBody (callback) {
    modifyRequestBodyWithoutSignatureUpdate(callback)

    const redeemedTicket = request.body.redeemedTicket
    redeemedTicket.signature = controllerTest.createSignature(redeemedTicket.content)
  }

  function modifyRequestBodyWithoutSignatureUpdate (callback) {
    callback()
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual)

    request = controllerTest.createRequest()
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

    response = controllerTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    controller = createValidateRedeemedTicketController()
  })

  describe('.validateRedeemedTicket', () => {
    describe('when redeemed ticket is valid', () => {
      it('should respond with OK', () => {
        controller.validateRedeemedTicket(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
        expect(responseBody).toEqual({})
      })
    })

    describe('when redeemed ticket has an invalid signature', () => {
      it('should respond with bad request error', () => {
        modifyRequestBodyWithoutSignatureUpdate(() => {
          request.body.redeemedTicket.content.description += '...' // Simulate forged content
        })

        controller.validateRedeemedTicket(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody).toEqual({
          error: {
            message: ja.matchType('string')
          }
        })
      })
    })
  })
})
