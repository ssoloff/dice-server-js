/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const controllerUtils = require('../../util/controller-utils')
const crypto = require('crypto')
const security = require('../../util/security')

module.exports = {
  create (controllerData) {
    function createResponseBody (request) {
      return {
        ticket: createTicket(request)
      }
    }

    function createSignature (content) {
      return security.createSignature(content, controllerData.privateKey, controllerData.publicKey)
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
      if (controllerUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
        return {
          description: requestBody.description,
          evaluateExpressionRequestBody: evaluateExpressionRequestBody,
          id: generateTicketId(),
          redeemUrl: getRedeemTicketUrl(request)
        }
      }

      const evaluateExpressionResponseBody = evaluateExpressionResult[1]
      throw controllerUtils.createControllerErrorFromResponse(
        evaluateExpressionResponseStatus,
        evaluateExpressionResponseBody
      )
    }

    function evaluateExpression (requestBody) {
      return controllerUtils.postJson(controllerData.evaluateExpressionController.evaluateExpression, requestBody)
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
          controllerData.privateKey,
          controllerData.publicKey
        )
        evaluateExpressionRequestBody.randomNumberGenerator = randomNumberGenerator
      }
      return evaluateExpressionRequestBody
    }

    function getRedeemTicketUrl (request) {
      return controllerUtils.getRequestRootUrl(request) + controllerData.redeemTicketPath
    }

    return {
      issueTicket (request, response) {
        try {
          controllerUtils.setSuccessResponse(response, createResponseBody(request))
        } catch (e) {
          controllerUtils.setFailureResponse(response, e)
        }
      }
    }
  }
}
