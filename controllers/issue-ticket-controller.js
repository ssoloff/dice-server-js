/*
 * Copyright (c) 2015 Steven Soloff
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

var controllerUtils = require('./support/controller-utils');
var crypto = require('crypto');
var httpStatus = require('http-status-codes');
var security = require('./support/security');

module.exports = {
    create: function (controllerData) {
        function createResponseBody(request) {
            try {
                return {
                    success: {
                        ticket: createTicket(request)
                    }
                };
            } catch (e) {
                return {
                    failure: {
                        message: e.message
                    }
                };
            }
        }

        function createSignature(content) {
            return security.createSignature(content, controllerData.privateKey, controllerData.publicKey);
        }

        function createTicket(request) {
            var ticketContent = createTicketContent(request);
            return {
                content: ticketContent,
                signature: createSignature(ticketContent)
            };
        }

        function createTicketContent(request) {
            var requestBody = request.body;
            var evaluateExpressionResult = evaluateExpression(requestBody.evaluateExpressionRequestBody);
            var evaluateExpressionResponseBody = evaluateExpressionResult[1];
            if (evaluateExpressionResponseBody.success) {
                return {
                    description: requestBody.description,
                    evaluateExpressionRequestBody: requestBody.evaluateExpressionRequestBody,
                    id: generateTicketId(),
                    redeemUrl: getRedeemTicketUrl(request)
                };
            } else if (evaluateExpressionResponseBody.failure) {
                throw new Error(evaluateExpressionResponseBody.failure.message);
            } else {
                var evaluateExpressionResponseStatus = evaluateExpressionResult[0];
                throw new Error('evaluate expression controller returned status ' + evaluateExpressionResponseStatus);
            }
        }

        function evaluateExpression(requestBody) {
            return controllerUtils.postJson(controllerData.evaluateExpressionController.evaluateExpression, requestBody);
        }

        function generateTicketId() {
            return crypto.randomBytes(20).toString('hex');
        }

        function getRedeemTicketUrl(request) {
            return controllerUtils.getRequestRootUrl(request) + controllerData.redeemTicketPath;
        }

        return {
            issueTicket: function (request, response) {
                response
                    .status(httpStatus.OK)
                    .json(createResponseBody(request));
            }
        };
    }
};

