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
  Given(/^a request with the description "(.*)"$/, function (description) {
    this.issueTicketService.setDescription(description)
  })

  Given('a request with the expression {stringInDoubleQuotes}', function (expression) {
    this.issueTicketService.setExpression(expression)
  })

  Given(
    'a request with the random number generator named {stringInDoubleQuotes}',
    function (randomNumberGeneratorName) {
      this.issueTicketService.setRandomNumberGenerator(randomNumberGeneratorName)
    }
  )

  When('the issue ticket service is invoked', function (callback) {
    this.issueTicketService.call((response) => {
      this.response = response
      callback()
    })
  })

  Then('the response should contain a link to the redeem ticket service', function () {
    expect(this.response.body.ticket.content.redeemUrl).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should contain a signed ticket', function () {
    expect(this.response.body.ticket.signature).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should contain a ticket identifier', function () {
    expect(this.response.body.ticket.content.id).to.match(/^[0-9A-Fa-f]{40}$/)
  })

  Then(/^the response should contain the description "(.*)"$/, function (description) {
    expect(this.response.body.ticket.content.description).to.equal(description)
  })

  Then('the response should contain the expression text {stringInDoubleQuotes}', function (expressionText) {
    expect(this.response.body.ticket.content.evaluateExpressionRequestBody.expression.text).to.equal(expressionText)
  })

  Then(
    'the response should contain the random number generator named {stringInDoubleQuotes}',
    function (randomNumberGeneratorName) {
      expect(this.response.body.ticket.content.evaluateExpressionRequestBody.randomNumberGenerator.content.name)
        .to.equal(randomNumberGeneratorName)
    }
  )

  Then('the response should indicate failure', function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should indicate success', function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
})
