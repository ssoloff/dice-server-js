/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const bodyParser = require('body-parser')
const services = require('../services')

module.exports = (app, privateKey, publicKey) => {
  const evaluateExpressionPath = '/api/expression/evaluate'
  const issueTicketPath = '/api/ticket/issue'
  const redeemTicketPath = '/api/ticket/redeem'
  const validateRedeemedTicketPath = '/api/ticket/validate-redeemed'

  const evaluateExpression = services.evaluateExpression({
    publicKey
  })
  const issueTicket = services.issueTicket({
    evaluateExpression,
    privateKey,
    publicKey,
    redeemTicketPath
  })
  const redeemTicket = services.redeemTicket({
    evaluateExpression,
    privateKey,
    publicKey,
    validateRedeemedTicketPath
  })
  const validateRedeemedTicket = services.validateRedeemedTicket({
    publicKey
  })

  app.use(bodyParser.json())

  app.post(evaluateExpressionPath, evaluateExpression)
  app.post(issueTicketPath, issueTicket)
  app.post(redeemTicketPath, redeemTicket)
  app.post(validateRedeemedTicketPath, validateRedeemedTicket)
}
