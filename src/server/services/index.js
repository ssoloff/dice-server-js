/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const evaluateExpression = require('./evaluate-expression')
const issueTicket = require('./issue-ticket')
const redeemTicket = require('./redeem-ticket')
const validateRedeemedTicket = require('./validate-redeemed-ticket')

function services (app) {
  const BASE_URI = '/api'
  const evaluateExpressionPath = `${BASE_URI}/expression/evaluate`
  const issueTicketPath = `${BASE_URI}/ticket/issue`
  const redeemTicketPath = `${BASE_URI}/ticket/redeem`
  const validateRedeemedTicketPath = `${BASE_URI}/ticket/validate-redeemed`

  const evaluateExpressionService = evaluateExpression({
    publicKey: app.locals.publicKey
  })
  const issueTicketService = issueTicket({
    evaluateExpression: evaluateExpressionService,
    privateKey: app.locals.privateKey,
    publicKey: app.locals.publicKey,
    redeemTicketPath
  })
  const redeemTicketService = redeemTicket({
    evaluateExpression: evaluateExpressionService,
    privateKey: app.locals.privateKey,
    publicKey: app.locals.publicKey,
    validateRedeemedTicketPath
  })
  const validateRedeemedTicketService = validateRedeemedTicket({
    publicKey: app.locals.publicKey
  })

  app.post(evaluateExpressionPath, evaluateExpressionService)
  app.post(issueTicketPath, issueTicketService)
  app.post(redeemTicketPath, redeemTicketService)
  app.post(validateRedeemedTicketPath, validateRedeemedTicketService)
}

services.evaluateExpression = evaluateExpression
services.issueTicket = issueTicket
services.redeemTicket = redeemTicket
services.validateRedeemedTicket = validateRedeemedTicket

module.exports = services
