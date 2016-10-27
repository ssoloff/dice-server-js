/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var bodyParser = require('body-parser');

module.exports = function (app, privateKey, publicKey) {
    var evaluateExpressionController,
        evaluateExpressionPath = '/expression/evaluate',
        issueTicketController,
        issueTicketPath = '/ticket/issue',
        redeemTicketController,
        redeemTicketPath = '/ticket/redeem',
        validateRedeemedTicketController,
        validateRedeemedTicketPath = '/ticket/validate-redeemed';

    evaluateExpressionController = require('./services/evaluate-expression/evaluate-expression-controller.js').create({
        publicKey: publicKey
    });
    issueTicketController = require('./services/issue-ticket/issue-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        redeemTicketPath: redeemTicketPath
    });
    redeemTicketController = require('./services/redeem-ticket/redeem-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        validateRedeemedTicketPath: validateRedeemedTicketPath
    });
    validateRedeemedTicketController = require('./services/validate-redeemed-ticket/validate-redeemed-ticket-controller.js').create({
        publicKey: publicKey
    });

    app.use(bodyParser.json());

    app.post(evaluateExpressionPath, evaluateExpressionController.evaluateExpression);
    app.post(issueTicketPath, issueTicketController.issueTicket);
    app.post(redeemTicketPath, redeemTicketController.redeemTicket);
    app.post(validateRedeemedTicketPath, validateRedeemedTicketController.validateRedeemedTicket);
};
