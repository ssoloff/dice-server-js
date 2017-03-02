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
const security = require('../../../src/server/util/security')
const services = require('../../../src/server/services')
const serviceTest = require('../test-support/service-test')

describe('evaluateExpression', () => {
  let request,
    response,
    responseBody,
    service

  function createEvaluateExpressionService () {
    return services.evaluateExpression({
      publicKey: serviceTest.getPublicKey()
    })
  }

  function modifyRequestBody (callback) {
    callback()

    const randomNumberGenerator = request.body.randomNumberGenerator
    if (randomNumberGenerator) {
      randomNumberGenerator.signature = serviceTest.createSignature(randomNumberGenerator.content)
    }
  }

  beforeEach(() => {
    jasmine.addCustomEqualityTester(serviceTest.isResponseBodyEqual)

    request = serviceTest.createRequest()
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

    response = serviceTest.createResponse((json) => {
      responseBody = json
    })
    responseBody = null

    service = createEvaluateExpressionService()
  })

  describe('when expression is well-formed', () => {
    it('should respond with OK', () => {
      service(request, response)

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
      service(request, response)

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

        service(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.OK)
        expect(responseBody.randomNumberGenerator.name).toBe('uniform')
      })
    })

    describe('when the uniform random number generator is specified', () => {
      it('should use the uniform random number generator', () => {
        modifyRequestBody(() => {
          request.body.randomNumberGenerator.content.name = 'uniform'
        })

        service(request, response)

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

        service(request, response)

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

        service(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })

    describe('when random number generator specification has an invalid signature', () => {
      it('should respond with bad request error', () => {
        const otherPrivateKey = serviceTest.getOtherPrivateKey()
        const otherPublicKey = serviceTest.getOtherPublicKey()

        request.body.randomNumberGenerator.signature = security.createSignature(
          request.body.randomNumberGenerator.content,
          otherPrivateKey, // Sign using unauthorized key
          otherPublicKey
        )

        service(request, response)

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

        service(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })

    describe('when result value is NaN', () => {
      it('should respond with bad request error', () => {
        modifyRequestBody(() => {
          request.body.expression.text = 'round(d6)'
        })

        service(request, response)

        expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST)
        expect(responseBody.error).toBeDefined()
      })
    })
  })
})
