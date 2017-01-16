/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const config = require('../../common/support/config')
const req = require('request')
const security = require('../../common/support/security')

class EvaluateExpressionService {
  constructor () {
    this.requestBody = {}
    this.requestId = null
  }

  call (callback) {
    const requestData = {
      body: this.requestBody,
      json: true,
      uri: `${config.baseUri}/api/expression/evaluate`
    }
    if (this.requestId) {
      requestData.headers = {
        'X-Request-ID': this.requestId
      }
    }

    req.post(requestData, (error, response) => {
      if (!error) {
        callback(response)
      } else {
        throw new Error(error)
      }
    })
  }

  setExpression (expressionText) {
    this.requestBody.expression = {
      text: expressionText
    }
  }

  setRandomNumberGenerator (randomNumberGeneratorName) {
    const randomNumberGenerator = {
      content: {
        name: randomNumberGeneratorName
      },
      signature: null
    }
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content)
    this.requestBody.randomNumberGenerator = randomNumberGenerator
  }

  setRequestId (requestId) {
    this.requestId = requestId
  }
}

module.exports = EvaluateExpressionService
