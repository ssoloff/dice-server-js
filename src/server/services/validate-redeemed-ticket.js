/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')
const security = require('../util/security')
const serviceUtils = require('../util/service-utils')

module.exports = (serviceData) => {
  function createResponseBody (request) {
    validateRequest(request)

    return {}
  }

  function isSignatureValid (content, signature) {
    return security.verifySignature(content, signature, serviceData.publicKey)
  }

  function validateRequest (request) {
    const redeemedTicket = request.body.redeemedTicket
    if (!isSignatureValid(redeemedTicket.content, redeemedTicket.signature)) {
      throw serviceUtils.createServiceError(
        httpStatus.BAD_REQUEST,
        'redeemed ticket signature is invalid'
      )
    }
  }

  return (request, response) => {
    try {
      serviceUtils.setSuccessResponse(response, createResponseBody(request))
    } catch (e) {
      serviceUtils.setFailureResponse(response, e)
    }
  }
}
