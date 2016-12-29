/*
 * Copyright (c) 2016 Steven Soloff
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
    this.validateRedeemedTicketService = this.createValidateRedeemedTicketService()
    this.response = null
    this.redeemedTicket = {
      forceInvalidSignature: false
    }
    callback()
  })

  this.Given(/^a redeemed ticket$/, function () {
    this.issueTicketService.setExpression('42')
    this.issueTicketService.setDescription('description')
  })

  this.Given(/^a redeemed ticket with an invalid signature$/, function () {
    this.issueTicketService.setExpression('42')
    this.issueTicketService.setDescription('description')
    this.redeemedTicket.forceInvalidSignature = true
  })

  this.When(/^the validate redeemed ticket service is invoked$/, function (callback) {
    this.issueTicketService.call((response) => {
      const issueTicketResponseBody = response.body

      if (response.statusCode !== httpStatus.OK) {
        throw new Error('failed to issue ticket')
      }

      this.redeemTicketService.setRequestFromIssueTicketResponseBody(issueTicketResponseBody)
      this.redeemTicketService.call((response) => {
        const redeemTicketResponseBody = response.body

        if (response.statusCode !== httpStatus.OK) {
          throw new Error('failed to redeem ticket')
        }

        if (this.redeemedTicket.forceInvalidSignature) {
          // Change content so signature will not match
          redeemTicketResponseBody.redeemedTicket.content.description += '...'
        }
        this.validateRedeemedTicketService.setRequestFromRedeemTicketResponseBody(redeemTicketResponseBody)
        this.validateRedeemedTicketService.call((response) => {
          this.response = response
          callback()
        })
      })
    })
  })

  this.Then(/^the response should indicate failure$/, function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist
  })

  this.Then(/^the response should indicate success$/, function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
}
