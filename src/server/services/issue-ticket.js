/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const crypto = require('crypto')
const security = require('../util/security')
const serviceUtils = require('../util/service-utils')

module.exports = (serviceData) => {
  function createResponseBody (request) {
    return {
      ticket: createTicket(request)
    }
  }

  function createSignature (content) {
    return security.createSignature(content, serviceData.privateKey, serviceData.publicKey)
  }

  function createTicket (request) {
    const ticketContent = createTicketContent(request)
    return {
      content: ticketContent,
      signature: createSignature(ticketContent)
    }
  }

  function createTicketContent (request) {
    const requestBody = request.body

    const evaluateExpressionRequestBody = getEvaluateExpressionRequestBody(requestBody)
    const evaluateExpressionResult = evaluateExpression(evaluateExpressionRequestBody)
    const evaluateExpressionResponseStatus = evaluateExpressionResult[0]
    if (serviceUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
      return {
        description: requestBody.description,
        evaluateExpressionRequestBody: evaluateExpressionRequestBody,
        id: generateTicketId(),
        redeemUrl: getRedeemTicketUrl(request)
      }
    }

    const evaluateExpressionResponseBody = evaluateExpressionResult[1]
    throw serviceUtils.createServiceErrorFromResponse(
      evaluateExpressionResponseStatus,
      evaluateExpressionResponseBody
    )
  }

  function evaluateExpression (requestBody) {
    return serviceUtils.postJson(serviceData.evaluateExpression, requestBody)
  }

  function generateRandomNumberGeneratorSeed () {
    const SEED_ELEMENT_LENGTH_IN_BYTES = 4
    const SEED_ARRAY_LENGTH = 16

    const seed = []
    const data = crypto.randomBytes(SEED_ARRAY_LENGTH * SEED_ELEMENT_LENGTH_IN_BYTES)
    _.times(SEED_ARRAY_LENGTH, (i) => {
      seed[i] = data.readUIntBE(i * SEED_ELEMENT_LENGTH_IN_BYTES, SEED_ELEMENT_LENGTH_IN_BYTES)
    })
    return seed
  }

  function generateTicketId () {
    return crypto.randomBytes(20).toString('hex')
  }

  function getEvaluateExpressionRequestBody (requestBody) {
    const evaluateExpressionRequestBody = requestBody.evaluateExpressionRequestBody
    if (!evaluateExpressionRequestBody.randomNumberGenerator) {
      const randomNumberGenerator = {
        content: {
          name: 'uniform',
          options: {
            seed: generateRandomNumberGeneratorSeed()
          }
        },
        signature: null
      }
      randomNumberGenerator.signature = security.createSignature(
        randomNumberGenerator.content,
        serviceData.privateKey,
        serviceData.publicKey
      )
      evaluateExpressionRequestBody.randomNumberGenerator = randomNumberGenerator
    }
    return evaluateExpressionRequestBody
  }

  function getRedeemTicketUrl (request) {
    return serviceUtils.getRequestRootUrl(request) + serviceData.redeemTicketPath
  }

  return (request, response) => {
    try {
      serviceUtils.setSuccessResponse(response, createResponseBody(request))
    } catch (e) {
      serviceUtils.setFailureResponse(response, e)
    }
  }
}
