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
const services = require('../../../src/server/services')

describe('issueTicket', () => {
  let request,
    response,
    responseBody,
    service

  function createIssueTicketService (evaluateExpression) {
    evaluateExpression = evaluateExpression || services.evaluateExpression({
      publicKey: serviceTest.getPublicKey()
    })
    return services.issueTicket({
      evaluateExpression,
      privateKey: serviceTest.getPrivateKey(),
      publicKey: serviceTest.getPublicKey(),
      redeemTicketPath: '/redeemTicketPath'
    })
  }

  function modifyRequestBody (callback) {
    callback()

    const randomNumberGenerator = request.body.evaluateExpressionRequestBody.randomNumberGenerator
    if (randomNumberGenerator) {
      randomNumberGenerator.signature = serviceTest.createSignature(randomNumberGenerator.content)
    }
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(serviceTest.isResponseBodyEqual)

    request = serviceTest.createRequest()
    modifyRequestBody(() => {
      request.body = {
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
        }
      }
    })

    response = serviceTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    service = createIssueTicketService()
  })

  describe('when evaluate expression service responds with success', () => {
    it('should respond with OK', () => {
      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual({
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
                signature: ja.matchType('object')
              }
            },
            id: ja.matchType('string'),
            redeemUrl: ja.matchType('string')
          },
          signature: ja.matchType('object')
        }
      })
    })

    it('should respond with a valid ticket', () => {
      service(request, response)

      expect(responseBody.ticket.content.id).toMatch(/^[0-9A-Fa-f]{40}$/)
    })

    it('should respond with a signed ticket', () => {
      service(request, response)

      expect(responseBody.ticket).toBeSigned()
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

      service = createIssueTicketService(stubEvaluateExpression)

      service(request, response)

      expect(response.status).toHaveBeenCalledWith(expectedStatus)
      expect(responseBody).toEqual({
        error: {
          message: expectedErrorMessage
        }
      })
    })
  })

  describe('when random number generator specification is not provided', () => {
    it('should use uniform random number generator with seed', () => {
      modifyRequestBody(() => {
        request.body = {
          description: 'description',
          evaluateExpressionRequestBody: {
            expression: {
              text: '3d6+4'
            }
          }
        }
      })

      service(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual({
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
                    seed: ja.matchType('object')
                  }
                },
                signature: ja.matchType('object')
              }
            },
            id: ja.matchType('string'),
            redeemUrl: ja.matchType('string')
          },
          signature: ja.matchType('object')
        }
      })
    })
  })
})
