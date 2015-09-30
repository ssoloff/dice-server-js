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

var crypto = require('crypto');
var httpStatus = require('http-status-codes');
var security = require('./security');

module.exports = {
    create: function (privateKey, publicKey, evaluateExpressionController) {

        function createResponse(request) {
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
            return security.createSignature(content, privateKey, publicKey);
        }

        function createTicket(request) {
            var ticketContent = createTicketContent(request);
            return {
                content: ticketContent,
                signature: createSignature(ticketContent)
            };
        }

        function createTicketContent(request) {
            var evaluateExpressionResult = evaluateExpression(request.evaluateExpressionRequest);
            var evaluateExpressionResponse = evaluateExpressionResult[1];
            if (evaluateExpressionResponse.success) {
                return {
                    description: request.description,
                    evaluateExpressionRequest: request.evaluateExpressionRequest,
                    id: generateTicketId()
                };
            } else if (evaluateExpressionResponse.failure) {
                throw new Error(evaluateExpressionResponse.failure.message);
            } else {
                var evaluateExpressionStatus = evaluateExpressionResult[0];
                throw new Error('evaluate expression controller returned status ' + evaluateExpressionStatus);
            }
        }

        function evaluateExpression(evaluateExpressionRequest) {
            var evaluateExpressionReq = {
                body: evaluateExpressionRequest
            };
            var evaluateExpressionResponse;
            var evaluateExpressionStatus;
            var evaluateExpressionRes = {
                json: function (json) {
                    evaluateExpressionResponse = json;
                    return this;
                },
                status: function (status) {
                    evaluateExpressionStatus = status;
                    return this;
                }
            };
            evaluateExpressionController.evaluateExpression(evaluateExpressionReq, evaluateExpressionRes);

            return [evaluateExpressionStatus, evaluateExpressionResponse];
        }

        function generateTicketId() {
            return crypto.randomBytes(20).toString('hex');
        }

        return {
            issueTicket: function (req, res) {
                var request = req.body;
                var response = createResponse(request);
                res.status(httpStatus.OK).json(response);
            }
        };
    }
};

