/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const controllerTest = require('../../test-support/controller-test')
const httpStatus = require('http-status-codes')
const ja = require('json-assert')

describe('issueTicketController', () => {
  let controller,
    request,
    response,
    responseBody

  function createIssueTicketController (evaluateExpressionController) {
    evaluateExpressionController = evaluateExpressionController ||
      require('../../../../src/server/services/evaluate-expression/controller').create({
        publicKey: controllerTest.getPublicKey()
      })
    return require('../../../../src/server/services/issue-ticket/controller').create({
      evaluateExpressionController: evaluateExpressionController,
      privateKey: controllerTest.getPrivateKey(),
      publicKey: controllerTest.getPublicKey(),
      redeemTicketPath: '/redeemTicketPath'
    })
  }

  function modifyRequestBody (callback) {
    callback()

    const randomNumberGenerator = request.body.evaluateExpressionRequestBody.randomNumberGenerator
    if (randomNumberGenerator) {
      randomNumberGenerator.signature = controllerTest.createSignature(randomNumberGenerator.content)
    }
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual)

    request = controllerTest.createRequest()
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

    response = controllerTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    controller = createIssueTicketController()
  })

  describe('.issueTicket', () => {
    describe('when evaluate expression controller responds with success', () => {
      it('should respond with OK', () => {
        controller.issueTicket(request, response)

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
        controller.issueTicket(request, response)

        expect(responseBody.ticket.content.id).toMatch(/^[0-9A-Fa-f]{40}$/)
      })

      it('should respond with a signed ticket', () => {
        controller.issueTicket(request, response)

        expect(responseBody.ticket).toBeSigned()
      })
    })

    describe('when evaluate expression controller responds with error', () => {
      it('should respond with same error', () => {
        const expectedStatus = httpStatus.BAD_GATEWAY
        const expectedErrorMessage = 'message'
        const stubEvaluateExpressionController = {
          evaluateExpression (request, response) {
            response.status(expectedStatus).json({
              error: {
                message: expectedErrorMessage
              }
            })
          }
        }

        controller = createIssueTicketController(stubEvaluateExpressionController)

        controller.issueTicket(request, response)

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

        controller.issueTicket(request, response)

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
})
