/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const req = require('request')

class ValidateRedeemedTicketService {
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
    req.post(requestData, (error, response) => {
      if (!error) {
        callback(response)
      } else {
        throw new Error(error)
      }
    })
  }

  setRequestFromRedeemTicketResponseBody (redeemTicketResponseBody) {
    this.requestBody.redeemedTicket = redeemTicketResponseBody.redeemedTicket
    this.requestUrl = redeemTicketResponseBody.redeemedTicket.content.validateUrl
  }
}

module.exports = ValidateRedeemedTicketService
