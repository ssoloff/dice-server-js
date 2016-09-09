/*
 * Copyright (c) 2016 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var bodyParser = require('body-parser');

module.exports = function (app, privateKey, publicKey) {
    var enumerateDiceController,
        enumerateDicePath = '/expression/enumerate-dice',
        evaluateExpressionController,
        evaluateExpressionPath = '/expression/evaluate',
        issueTicketController,
        issueTicketPath = '/ticket/issue',
        redeemTicketController,
        redeemTicketPath = '/ticket/redeem',
        validateRedeemedTicketController,
        validateRedeemedTicketPath = '/ticket/validate-redeemed';

    enumerateDiceController = require('./controllers/enumerate-dice-controller.js').create();
    evaluateExpressionController = require('./controllers/evaluate-expression-controller.js').create({
        publicKey: publicKey
    });
    issueTicketController = require('./controllers/issue-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        redeemTicketPath: redeemTicketPath
    });
    redeemTicketController = require('./controllers/redeem-ticket-controller.js').create({
        evaluateExpressionController: evaluateExpressionController,
        privateKey: privateKey,
        publicKey: publicKey,
        validateRedeemedTicketPath: validateRedeemedTicketPath
    });
    validateRedeemedTicketController = require('./controllers/validate-redeemed-ticket-controller.js').create({
        publicKey: publicKey
    });

    app.use(bodyParser.json());

    app.post(enumerateDicePath, enumerateDiceController.enumerateDice);
    app.post(evaluateExpressionPath, evaluateExpressionController.evaluateExpression);
    app.post(issueTicketPath, issueTicketController.issueTicket);
    app.post(redeemTicketPath, redeemTicketController.redeemTicket);
    app.post(validateRedeemedTicketPath, validateRedeemedTicketController.validateRedeemedTicket);
};
