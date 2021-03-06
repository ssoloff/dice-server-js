/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')
const httpStatus = require('http-status-codes')

defineSupportCode(({Given, When, Then}) => {
  Given('a request with the expression {string}', function (expression) {
    this.evaluateExpressionService.setExpression(expression)
  })

  Given('a request with the ID {string}', function (requestId) {
    this.evaluateExpressionService.setRequestId(requestId)
  })

  Given('a request with the random number generator named {string}', function (randomNumberGeneratorName) {
    this.evaluateExpressionService.setRandomNumberGenerator(randomNumberGeneratorName)
  })

  When('the evaluate expression service is invoked', function (callback) {
    this.evaluateExpressionService.call((response) => {
      this.response = response
      callback()
    })
  })

  Then('the response should be', function (jsonResponse) {
    expect(this.response.body).to.deep.equal(JSON.parse(jsonResponse))
  })

  Then('the response should contain the correlation ID {string}', function (correlationId) {
    expect(this.objectUtil.getPropertyValue(this.response.headers, 'X-Correlation-ID')).to.equal(correlationId)
  })

  Then(/^the response should contain the die roll results "(.*)"$/, function (jsonDieRollResults) {
    expect(this.response.body.dieRollResults).to.deep.equal(JSON.parse(jsonDieRollResults))
  })

  Then('the response should contain the expression result text {string}', function (expressionResultText) {
    expect(this.response.body.expressionResult.text).to.equal(expressionResultText)
  })

  Then('the response should contain the expression result value {float}', function (expressionResultValue) {
    expect(this.response.body.expressionResult.value).to.equal(parseFloat(expressionResultValue))
  })

  Then('the response should contain the expression result value {int}', function (expressionResultValue) {
    expect(this.response.body.expressionResult.value).to.equal(parseInt(expressionResultValue, 10))
  })

  Then('the response should indicate failure', function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should indicate success', function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
})
