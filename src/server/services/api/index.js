/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const evaluateExpression = require('./evaluate-expression')
const express = require('express')
const issueTicket = require('./issue-ticket')
const redeemTicket = require('./redeem-ticket')
const validateRedeemedTicket = require('./validate-redeemed-ticket')

function api (app) {
  const evaluateExpressionPath = '/expression/evaluate'
  const issueTicketPath = '/ticket/issue'
  const redeemTicketPath = '/ticket/redeem'
  const validateRedeemedTicketPath = '/ticket/validate-redeemed'

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

  const api = express.Router()
  api.post(evaluateExpressionPath, evaluateExpressionService)
  api.post(issueTicketPath, issueTicketService)
  api.post(redeemTicketPath, redeemTicketService)
  api.post(validateRedeemedTicketPath, validateRedeemedTicketService)
  return api
}

module.exports = _.extend(api, {
  evaluateExpression,
  issueTicket,
  redeemTicket,
  validateRedeemedTicket
})
