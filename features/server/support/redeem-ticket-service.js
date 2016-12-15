/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const req = require('request')

class RedeemTicketService {
  constructor () {
    this.requestBody = {}
    this.requestUrl = null
  }

  call (callback) {
    const requestData = {
      body: this.requestBody,
      json: true,
      uri: this.requestUrl
    }
    req.post(requestData, (error, response, body) => {
      if (!error) {
        callback(response.statusCode, body)
      } else {
        throw new Error(error)
      }
    })
  }

  setRequestFromIssueTicketResponseBody (issueTicketResponseBody) {
    this.requestBody.ticket = issueTicketResponseBody.ticket
    this.requestUrl = issueTicketResponseBody.ticket.content.redeemUrl
  }
}

module.exports = RedeemTicketService
