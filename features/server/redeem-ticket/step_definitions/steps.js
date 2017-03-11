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
    this.issueTicketService = this.createIssueTicketService()
    this.redeemTicketService = this.createRedeemTicketService()
    this.response = null
    this.previousResponse = null
    this.ticket = {
      description: null,
      forceInvalidSignature: false,
      forceRedeemed: false,
      id: null
    }
    callback()
  })

  this.Given(/^a ticket$/, function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
  })

  this.Given(/^a ticket that has already been redeemed$/, function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
    this.ticket.forceRedeemed = true
  })

  this.Given(/^a ticket with an invalid signature$/, function () {
    this.issueTicketService.setExpression('3d6')
    this.issueTicketService.setDescription('description')
    this.ticket.forceInvalidSignature = true
  })

  this.Given(/^a ticket with the description "(.*)"$/, function (description) {
    this.issueTicketService.setDescription(description)
  })

  this.Given(/^a ticket with the expression "(.*)"$/, function (expression) {
    this.issueTicketService.setExpression(expression)
  })

  this.Given(/^a ticket with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
    this.issueTicketService.setRandomNumberGenerator(randomNumberGeneratorName)
  })

  this.When(/^the redeem ticket service is invoked$/, function (callback) {
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

  this.Then(/^the response should contain a link to the validate redeemed ticket service$/, function () {
    expect(this.response.body.redeemedTicket.content.validateUrl).to.exist // eslint-disable-line no-unused-expressions
  })

  this.Then(/^the response should contain a signed redeemed ticket$/, function () {
    expect(this.response.body.redeemedTicket.signature).to.exist // eslint-disable-line no-unused-expressions
  })

  this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
    expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.text)
      .to.equal(expressionResultText)
  })

  this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
    expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.value)
      .to.equal(parseFloat(expressionResultValue))
  })

  this.Then(/^the response should contain the ticket description$/, function () {
    expect(this.response.body.redeemedTicket.content.description).to.equal(this.ticket.description)
  })

  this.Then(/^the response should contain the ticket identifier$/, function () {
    expect(this.response.body.redeemedTicket.content.id).to.equal(this.ticket.id)
  })

  this.Then(/^the response should equal the previous response$/, function () {
    expect(this.response.body).to.deep.equal(this.previousResponse.body)
  })

  this.Then(/^the response should indicate failure$/, function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist // eslint-disable-line no-unused-expressions
  })

  this.Then(/^the response should indicate success$/, function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
}
