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
const security = require('../../../src/server/util/security')

describe('evaluateExpressionController', () => {
  let controller,
    request,
    response,
    responseBody

  function createEvaluateExpressionController () {
    return require('../../../src/server/services/evaluate-expression')({
      publicKey: controllerTest.getPublicKey()
    })
  }

  function modifyRequestBody (callback) {
    callback()

    const randomNumberGenerator = request.body.randomNumberGenerator
    if (randomNumberGenerator) {
      randomNumberGenerator.signature = controllerTest.createSignature(randomNumberGenerator.content)
    }
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual)

    request = controllerTest.createRequest()
    modifyRequestBody(() => {
      request.body = {
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
    })

    response = controllerTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    controller = createEvaluateExpressionController()
  })

  describe('when expression is well-formed', () => {
    it('should respond with OK', () => {
      controller(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
      expect(responseBody).toEqual({
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
      })
    })
  })

  describe('when expression is malformed', () => {
    beforeEach(() => {
      modifyRequestBody(() => {
        request.body.expression.text = '<<INVALID>>'
      })
    })

    it('should respond with bad request error', () => {
      controller(request, response)

      expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
      expect(responseBody).toEqual({
        error: {
          message: ja.matchType('string')
        }
      })
    })
  })

  describe('specifying a random number generator', () => {
    describe('when the random number generator is not specified', () => {
      it('should use the default random number generator', () => {
        modifyRequestBody(() => {
          delete request.body.randomNumberGenerator
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
        expect(responseBody.randomNumberGenerator.name).toBe('uniform')
      })
    })

    describe('when the uniform random number generator is specified', () => {
      it('should use the uniform random number generator', () => {
        modifyRequestBody(() => {
          request.body.randomNumberGenerator.content.name = 'uniform'
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
        expect(responseBody.randomNumberGenerator.name).toBe('uniform')
        expect(responseBody.expressionResult.value).toBeGreaterThan(2 + 4)
        expect(responseBody.expressionResult.value).toBeLessThan(19 + 4)
      })
    })

    describe('when the constantMax random number generator is specified', () => {
      it('should use the constantMax random number generator', () => {
        modifyRequestBody(() => {
          request.body.randomNumberGenerator.content.name = 'constantMax'
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
        expect(responseBody.randomNumberGenerator.name).toBe('constantMax')
        expect(responseBody.expressionResult.value).toBe(22)
      })
    })

    describe('when an unknown random number generator is specified', () => {
      it('should respond with bad request error', () => {
        modifyRequestBody(() => {
          request.body.randomNumberGenerator.content.name = '<<UNKNOWN>>'
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })

    describe('when random number generator specification has an invalid signature', () => {
      it('should respond with bad request error', () => {
        const otherPrivateKey = controllerTest.getOtherPrivateKey()
        const otherPublicKey = controllerTest.getOtherPublicKey()

        request.body.randomNumberGenerator.signature = security.createSignature(
          request.body.randomNumberGenerator.content,
          otherPrivateKey, // Sign using unauthorized key
          otherPublicKey
        )

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })
  })

  describe('evaluating an expression whose result value is not a finite number', () => {
    describe('when result value is not a number', () => {
      it('should respond with bad request error', () => {
        modifyRequestBody(() => {
          request.body.expression.text = 'd6'
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })

    describe('when result value is NaN', () => {
      it('should respond with bad request error', () => {
        modifyRequestBody(() => {
          request.body.expression.text = 'round(d6)'
        })

        controller(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })
  })
})
