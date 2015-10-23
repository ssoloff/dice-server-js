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
var httpStatus = require('http-status-codes');
var security = require('./support/security');

module.exports = {
    create: function (controllerData) {
        function createRedeemedTicket(request) {
            var redeemedTicketContent = createRedeemedTicketContent(request);
            return {
                content: redeemedTicketContent,
                signature: createSignature(redeemedTicketContent)
            };
        }

        function createRedeemedTicketContent(request) {
            var requestBody = request.body;
            var ticketContent = requestBody.ticket.content;
            var evaluateExpressionResult = evaluateExpression(ticketContent.evaluateExpressionRequestBody);
            var evaluateExpressionResponseStatus = evaluateExpressionResult[0];
            var evaluateExpressionResponseBody = evaluateExpressionResult[1];
            if (controllerUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
                return {
                    description: ticketContent.description,
                    evaluateExpressionResponseBody: evaluateExpressionResponseBody,
                    id: ticketContent.id,
                    validateUrl: getValidateRedeemedTicketUrl(request)
                };
            } else {
                throw controllerUtils.createControllerErrorFromResponse(
                    evaluateExpressionResponseStatus,
                    evaluateExpressionResponseBody
                );
            }
        }

        function createResponseBody(request) {
            validateRequest(request);

            return {
                redeemedTicket: createRedeemedTicket(request)
            };
        }

        function createSignature(content) {
            return security.createSignature(content, controllerData.privateKey, controllerData.publicKey);
        }

        function evaluateExpression(requestBody) {
            return controllerUtils.postJson(controllerData.evaluateExpressionController.evaluateExpression, requestBody);
        }

        function getValidateRedeemedTicketUrl(request) {
            return controllerUtils.getRequestRootUrl(request) + controllerData.validateRedeemedTicketPath;
        }

        function isSignatureValid(content, signature) {
            return security.verifySignature(content, signature, controllerData.publicKey);
        }

        function validateRequest(request) {
            var ticket = request.body.ticket;
            if (!isSignatureValid(ticket.content, ticket.signature)) {
                throw controllerUtils.createControllerError(
                    httpStatus.BAD_REQUEST,
                    'ticket signature is invalid'
                );
            }
        }

        return {
            redeemTicket: function (request, response) {
                try {
                    controllerUtils.setSuccessResponse(response, createResponseBody(request));
                } catch (e) {
                    controllerUtils.setFailureResponse(response, e);
                }
            }
        };
    }
};

