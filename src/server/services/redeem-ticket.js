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
  function createRedeemedTicket (request) {
    const redeemedTicketContent = createRedeemedTicketContent(request)
    return {
      content: redeemedTicketContent,
      signature: createSignature(redeemedTicketContent)
    }
  }

  function createRedeemedTicketContent (request) {
    const ticketContent = request.body.ticket.content

    const evaluateExpressionResult = evaluateExpression(ticketContent.evaluateExpressionRequestBody)
    const evaluateExpressionResponseStatus = evaluateExpressionResult[0]
    const evaluateExpressionResponseBody = evaluateExpressionResult[1]
    if (serviceUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
      return {
        description: ticketContent.description,
        evaluateExpressionResponseBody,
        id: ticketContent.id,
        validateUrl: getValidateRedeemedTicketUrl(request)
      }
    }

    throw serviceUtils.createServiceErrorFromResponse(
      evaluateExpressionResponseStatus,
      evaluateExpressionResponseBody
    )
  }

  function createResponseBody (request) {
    validateRequest(request)

    return {
      redeemedTicket: createRedeemedTicket(request)
    }
  }

  function createSignature (content) {
    return security.createSignature(content, serviceData.privateKey, serviceData.publicKey)
  }

  function evaluateExpression (requestBody) {
    return serviceUtils.postJson(serviceData.evaluateExpression, requestBody)
  }

  function getValidateRedeemedTicketUrl (request) {
    return serviceUtils.getRequestRootUrl(request) + serviceData.validateRedeemedTicketPath
  }

  function isSignatureValid (content, signature) {
    return security.verifySignature(content, signature, serviceData.publicKey)
  }

  function validateRequest (request) {
    const ticket = request.body.ticket
    if (!isSignatureValid(ticket.content, ticket.signature)) {
      throw serviceUtils.createServiceError(
        httpStatus.BAD_REQUEST,
        'ticket signature is invalid'
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
