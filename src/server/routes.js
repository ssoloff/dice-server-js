/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const bodyParser = require('body-parser')

module.exports = (app, privateKey, publicKey) => {
  const evaluateExpressionPath = '/api/expression/evaluate'
  const issueTicketPath = '/api/ticket/issue'
  const redeemTicketPath = '/api/ticket/redeem'
  const validateRedeemedTicketPath = '/api/ticket/validate-redeemed'

  const evaluateExpressionController = require('./services/evaluate-expression/controller')
    .create({
      publicKey: publicKey
    })
  const issueTicketController = require('./services/issue-ticket/controller')
    .create({
      evaluateExpressionController: evaluateExpressionController,
      privateKey: privateKey,
      publicKey: publicKey,
      redeemTicketPath: redeemTicketPath
    })
  const redeemTicketController = require('./services/redeem-ticket/controller')
    .create({
      evaluateExpressionController: evaluateExpressionController,
      privateKey: privateKey,
      publicKey: publicKey,
      validateRedeemedTicketPath: validateRedeemedTicketPath
    })
  const validateRedeemedTicketController = require('./services/validate-redeemed-ticket/controller')
    .create({
      publicKey: publicKey
    })

  app.use(bodyParser.json())

  app.post(evaluateExpressionPath, evaluateExpressionController.evaluateExpression)
  app.post(issueTicketPath, issueTicketController.issueTicket)
  app.post(redeemTicketPath, redeemTicketController.redeemTicket)
  app.post(validateRedeemedTicketPath, validateRedeemedTicketController.validateRedeemedTicket)
}
