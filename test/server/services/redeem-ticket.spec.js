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

describe('redeemTicket', () => {
  let request,
    response,
    responseBody,
    service

  function createRedeemTicketService (evaluateExpression) {
    evaluateExpression = evaluateExpression ||
      require('../../../src/server/services/evaluate-expression')({
        publicKey: serviceTest.getPublicKey()
      })
    return require('../../../src/server/services/redeem-ticket')({
      evaluateExpression: evaluateExpression,
      privateKey: serviceTest.getPrivateKey(),
      publicKey: serviceTest.getPublicKey(),
      validateRedeemedTicketPath: '/validateRedeemedTicketPath'
    })
  }

  function modifyRequestBody (callback) {
    modifyRequestBodyWithoutSignatureUpdate(callback)

    const randomNumberGenerator = request.body.ticket.content.evaluateExpressionRequestBody.randomNumberGenerator
    randomNumberGenerator.signature = serviceTest.createSignature(randomNumberGenerator.content)

    const ticket = request.body.ticket
    ticket.signature = serviceTest.createSignature(ticket.content)
  }

  function modifyRequestBodyWithoutSignatureUpdate (callback) {
    callback()
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(serviceTest.isResponseBodyEqual)

    request = serviceTest.createRequest()
    modifyRequestBody(() => {
      request.body = {
        ticket: {
          content: {
            description: 'description',
            evaluateExpressionRequestBody: {
              expression: {
                text: '3d6+4'
              },
              randomNumberGenerator: {
                content: {
                  name: 'constantMax'
                },
                signature: null
              }
            },
            id: '00112233445566778899aabbccddeeff00112233',
            redeemUrl: 'http://host:1234/redeemTicketPath'
          },
          signature: null
        }
      }
    })

    response = serviceTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    service = createRedeemTicketService()
  })

  describe('when evaluate expression service responds with success', () => {
    it('should respond with OK', () => {
      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual({
        redeemedTicket: {
          content: {
            description: 'description',
            evaluateExpressionResponseBody: {
              dieRollResults: [
                {
                  sides: 6,
                  value: 6
                },
                {
                  sides: 6,
                  value: 6
                },
                {
                  sides: 6,
                  value: 6
                }
              ],
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
            validateUrl: ja.matchType('string')
          },
          signature: ja.matchType('object')
        }
      })
    })

    it('should respond with a signed redeemed ticket', () => {
      service(request, response)

      expect(responseBody.redeemedTicket).toBeSigned()
    })
  })

  describe('when evaluate expression service responds with error', () => {
    it('should respond with same error', () => {
      const expectedStatus = httpStatus.BAD_GATEWAY
      const expectedErrorMessage = 'message'
      const stubEvaluateExpression = (request, response) => {
        response.status(expectedStatus).json({
          error: {
            message: expectedErrorMessage
          }
        })
      }

      service = createRedeemTicketService(stubEvaluateExpression)

      service(request, response)

      expect(response.status).toHaveBeenCalledWith(expectedStatus)
      expect(responseBody).toEqual({
        error: {
          message: expectedErrorMessage
        }
      })
    })
  })

  describe('when ticket has an invalid signature', () => {
    it('should respond with bad request error', () => {
      modifyRequestBodyWithoutSignatureUpdate(() => {
        request.body.ticket.content.description += '...' // Simulate forged content
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

  describe('when ticket has already been redeemed', () => {
    it('should respond with same result as previous redemption', () => {
      modifyRequestBody(() => {
        request.body = {
          ticket: {
            content: {
              description: 'description',
              evaluateExpressionRequestBody: {
                expression: {
                  text: '3d6+4'
                },
                randomNumberGenerator: {
                  content: {
                    name: 'uniform',
                    options: {
                      seed: [1, 2, 3]
                    }
                  },
                  signature: null
                }
              },
              id: '00112233445566778899aabbccddeeff00112233',
              redeemUrl: 'http://host:1234/redeemTicketPath'
            },
            signature: null
          }
        }
      })
      service(request, response)
      const firstResponseBody = responseBody
      responseBody = null

      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual(firstResponseBody)
    })
  })
})
