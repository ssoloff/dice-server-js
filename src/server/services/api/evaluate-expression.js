/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const dice = require('../../model/dice')
const diceExpressionResultUtils = require('../../model/dice-expression-result-utils')
const httpStatus = require('http-status-codes')
const random = require('../../util/random')
const security = require('../../util/security')
const serviceUtils = require('../../util/service-utils')

module.exports = (serviceData) => {
  function createRandomNumberGenerator (randomNumberGeneratorSpecification) {
    switch (randomNumberGeneratorSpecification.name) {
      case 'constantMax': {
        return random.constantMax()
      }

      case 'uniform': {
        return random.uniform(randomNumberGeneratorSpecification.options)
      }
    }

    throw serviceUtils.createServiceError(
      httpStatus.BAD_REQUEST,
      `unknown random number generator "${randomNumberGeneratorSpecification.name}"`
    )
  }

  function createResponseBody (request) {
    const requestBody = request.body
    const responseBody = {}

    const randomNumberGeneratorSpecification = getRandomNumberGeneratorSpecification(requestBody)
    responseBody.randomNumberGenerator = randomNumberGeneratorSpecification

    const expression = parseExpressionText(requestBody.expression.text, randomNumberGeneratorSpecification)
    responseBody.expression = {
      canonicalText: formatExpression(expression),
      text: requestBody.expression.text
    }

    const expressionResult = expression.evaluate()
    if (!_.isFinite(expressionResult.value)) {
      throw serviceUtils.createServiceError(
        httpStatus.BAD_REQUEST,
        'expression does not evaluate to a finite number'
      )
    }
    responseBody.expressionResult = {
      text: formatExpressionResult(expressionResult),
      value: expressionResult.value
    }

    responseBody.dieRollResults = enumerateDieRollResults(expressionResult)

    return responseBody
  }

  function enumerateDieRollResults (expressionResult) {
    return diceExpressionResultUtils.enumerateDieRollResults(expressionResult)
  }

  function formatExpression (expression) {
    return dice.expressionFormatter.format(expression)
  }

  function formatExpressionResult (expressionResult) {
    return dice.expressionResultFormatter.format(expressionResult)
  }

  function getDefaultRandomNumberGeneratorSpecification () {
    return {
      name: 'uniform'
    }
  }

  function getRandomNumberGeneratorSpecification (requestBody) {
    const randomNumberGenerator = requestBody.randomNumberGenerator
    if (!randomNumberGenerator) {
      return getDefaultRandomNumberGeneratorSpecification()
    }

    if (!isSignatureValid(randomNumberGenerator.content, randomNumberGenerator.signature)) {
      throw serviceUtils.createServiceError(
        httpStatus.BAD_REQUEST,
        'random number generator specification signature is invalid'
      )
    }
    return randomNumberGenerator.content
  }

  function isSignatureValid (content, signature) {
    return security.verifySignature(content, signature, serviceData.publicKey)
  }

  function parseExpressionText (expressionText, randomNumberGeneratorSpecification) {
    const expressionParserContext = dice.expressionParser.createDefaultContext()
    expressionParserContext.bag = dice.bag.create(createRandomNumberGenerator(randomNumberGeneratorSpecification))
    const expressionParser = dice.expressionParser.create(expressionParserContext)
    try {
      return expressionParser.parse(expressionText)
    } catch (e) {
      throw serviceUtils.createServiceError(httpStatus.BAD_REQUEST, e.message)
    }
  }

  return (request, response) => {
    try {
      serviceUtils.setSuccessResponse(response, createResponseBody(request))
    } catch (e) {
      serviceUtils.setFailureResponse(response, e)
    }
  }
}
