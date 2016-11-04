/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const bodyParser = require('body-parser');

module.exports = function (app, privateKey, publicKey) {
    const evaluateExpressionPath = '/expression/evaluate';
    const issueTicketPath = '/ticket/issue';
    const redeemTicketPath = '/ticket/redeem';
    const validateRedeemedTicketPath = '/ticket/validate-redeemed';

    const evaluateExpressionController = require('./services/evaluate-expression/evaluate-expression-controller.js').create({
        publicKey: publicKey
    });
    const issueTicketController = require('./services/issue-ticket/issue-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        redeemTicketPath: redeemTicketPath
    });
    const redeemTicketController = require('./services/redeem-ticket/redeem-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        validateRedeemedTicketPath: validateRedeemedTicketPath
    });
    const validateRedeemedTicketController = require('./services/validate-redeemed-ticket/validate-redeemed-ticket-controller.js').create({
        publicKey: publicKey
    });

    app.use(bodyParser.json());

    app.post(evaluateExpressionPath, evaluateExpressionController.evaluateExpression);
    app.post(issueTicketPath, issueTicketController.issueTicket);
    app.post(redeemTicketPath, redeemTicketController.redeemTicket);
    app.post(validateRedeemedTicketPath, validateRedeemedTicketController.validateRedeemedTicket);
};
