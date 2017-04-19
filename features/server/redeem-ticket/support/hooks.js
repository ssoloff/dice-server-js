/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const { defineSupportCode } = require('cucumber')

defineSupportCode(({Before}) => {
  Before(function (scenarioResult, callback) {
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
})
