/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const controllerUtils = require('../util/controller-utils')
const httpStatus = require('http-status-codes')
const security = require('../util/security')

module.exports = (controllerData) => {
  function createResponseBody (request) {
    validateRequest(request)

    return {}
  }

  function isSignatureValid (content, signature) {
    return security.verifySignature(content, signature, controllerData.publicKey)
  }

  function validateRequest (request) {
    const redeemedTicket = request.body.redeemedTicket
    if (!isSignatureValid(redeemedTicket.content, redeemedTicket.signature)) {
      throw controllerUtils.createControllerError(
        httpStatus.BAD_REQUEST,
        'redeemed ticket signature is invalid'
      )
    }
  }

  return (request, response) => {
    try {
      controllerUtils.setSuccessResponse(response, createResponseBody(request))
    } catch (e) {
      controllerUtils.setFailureResponse(response, e)
    }
  }
}
