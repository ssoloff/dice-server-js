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
  Given('a redeemed ticket', function () {
    this.issueTicketService.setExpression('42')
    this.issueTicketService.setDescription('description')
  })

  Given('a redeemed ticket with an invalid signature', function () {
    this.issueTicketService.setExpression('42')
    this.issueTicketService.setDescription('description')
    this.redeemedTicket.forceInvalidSignature = true
  })

  When('the validate redeemed ticket service is invoked', function (callback) {
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

  Then('the response should indicate failure', function () {
    expect(this.response.statusCode).to.not.equal(httpStatus.OK)
    expect(this.response.body.error).to.exist // eslint-disable-line no-unused-expressions
  })

  Then('the response should indicate success', function () {
    expect(this.response.statusCode).to.equal(httpStatus.OK)
  })
})
