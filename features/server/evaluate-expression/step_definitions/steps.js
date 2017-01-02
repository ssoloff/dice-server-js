/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const chai = require('chai')
const httpStatus = require('http-status-codes')

const expect = chai.expect

module.exports = function () {
  this.Before(function (scenario, callback) {
    this.evaluateExpressionService = this.createEvaluateExpressionService()
    this.response = null
    callback()
  })

  this.Given(/^a request with the expression "(.*)"$/, function (expression) {
    this.evaluateExpressionService.setExpression(expression)
  })

  this.Given(/^a request with the ID "([^"]+)"$/, function (requestId) {
    this.evaluateExpressionService.setRequestId(requestId)
  })

  this.Given(/^a request with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
    this.evaluateExpressionService.setRandomNumberGenerator(randomNumberGeneratorName)
  })

  this.When(/^the evaluate expression service is invoked$/, function (callback) {
    this.evaluateExpressionService.call((response) => {
      this.response = response
      callback()
    })
  })

  this.Then(/^the response should be$/, function (jsonResponse) {
    expect(this.response.body).to.deep.equal(JSON.parse(jsonResponse))
  })

  this.Then(/^the response should contain the correlation ID "([^"]+)"$/, function (correlationId) {
    expect(this.objectUtil.getPropertyValue(this.response.headers, 'X-Correlation-ID')).to.equal(correlationId)
  })

  this.Then(/^the response should contain the die roll results "(.*)"$/, function (jsonDieRollResults) {
    expect(this.response.body.dieRollResults).to.deep.equal(JSON.parse(jsonDieRollResults))
  })

  this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
    expect(this.response.body.expressionResult.text).to.equal(expressionResultText)
  })

  this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
    expect(this.response.body.expressionResult.value).to.equal(parseFloat(expressionResultValue))
  })

  this.Then(/^the response should indicate failure$/, function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist
  })

  this.Then(/^the response should indicate success$/, function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
}
