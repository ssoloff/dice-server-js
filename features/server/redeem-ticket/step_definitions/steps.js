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
  Given('a ticket', function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
  })

  Given('a ticket that has already been redeemed', function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
    this.ticket.forceRedeemed = true
  })

  Given('a ticket with an invalid signature', function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
    this.ticket.forceInvalidSignature = true
  })

  Given('a ticket with the description {stringInDoubleQuotes}', function (description) {
    this.issueTicketService.setDescription(description)
  })

  Given('a ticket with the expression {stringInDoubleQuotes}', function (expression) {
    this.issueTicketService.setExpression(expression)
  })

  Given('a ticket with the random number generator named {stringInDoubleQuotes}', function (randomNumberGeneratorName) {
    this.issueTicketService.setRandomNumberGenerator(randomNumberGeneratorName)
  })

  When('the redeem ticket service is invoked', function (callback) {
    this.issueTicketService.call((response) => {
      const issueTicketResponseBody = response.body

      if (response.statusCode !== httpStatus.OK) {
        throw new Error('failed to issue ticket')
      }

      this.ticket.description = issueTicketResponseBody.ticket.content.description
      this.ticket.id = issueTicketResponseBody.ticket.content.id

      if (this.ticket.forceInvalidSignature) {
        issueTicketResponseBody.ticket.content.description += '...' // Change content so signature will not match
      }
      this.redeemTicketService.setRequestFromIssueTicketResponseBody(issueTicketResponseBody)

      const redeemTicketServiceResponseHandler = (response) => {
        this.response = response
        callback()
      }
      if (this.ticket.forceRedeemed) {
        this.redeemTicketService.call((response) => {
          this.previousResponse = response
          this.redeemTicketService.call(redeemTicketServiceResponseHandler)
        })
      } else {
        this.redeemTicketService.call(redeemTicketServiceResponseHandler)
      }
    })
  })

  Then('the response should contain a link to the validate redeemed ticket service', function () {
    expect(this.response.body.redeemedTicket.content.validateUrl).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should contain a signed redeemed ticket', function () {
    expect(this.response.body.redeemedTicket.signature).to.exist // eslint-disable-line no-unused-expressions
  })

  Then(
    'the response should contain the expression result text {stringInDoubleQuotes}',
    function (expressionResultText) {
      expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.text)
        .to.equal(expressionResultText)
    }
  )

  Then('the response should contain the expression result value {float}', function (expressionResultValue) {
    expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.value)
      .to.equal(parseFloat(expressionResultValue))
  })

  Then('the response should contain the ticket description', function () {
    expect(this.response.body.redeemedTicket.content.description).to.equal(this.ticket.description)
  })

  Then('the response should contain the ticket identifier', function () {
    expect(this.response.body.redeemedTicket.content.id).to.equal(this.ticket.id)
  })

  Then('the response should equal the previous response', function () {
    expect(this.response.body).to.deep.equal(this.previousResponse.body)
  })

  Then('the response should indicate failure', function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should indicate success', function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
})
