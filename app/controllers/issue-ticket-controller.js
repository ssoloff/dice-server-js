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
var security = require('./support/security');

module.exports = {
    create: function (controllerData) {
        function createResponseBody(request) {
            return {
                ticket: createTicket(request)
            };
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
            var evaluateExpressionRequestBody = getEvaluateExpressionRequestBody(requestBody);
            var evaluateExpressionResult = evaluateExpression(evaluateExpressionRequestBody);
            var evaluateExpressionResponseStatus = evaluateExpressionResult[0];
            if (controllerUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
                return {
                    description: requestBody.description,
                    evaluateExpressionRequestBody: evaluateExpressionRequestBody,
                    id: generateTicketId(),
                    redeemUrl: getRedeemTicketUrl(request)
                };
            } else {
                var evaluateExpressionResponseBody = evaluateExpressionResult[1];
                throw controllerUtils.createControllerErrorFromResponse(
                    evaluateExpressionResponseStatus,
                    evaluateExpressionResponseBody
                );
            }
        }

        function evaluateExpression(requestBody) {
            return controllerUtils.postJson(controllerData.evaluateExpressionController.evaluateExpression, requestBody);
        }

        function generateRandomNumberGeneratorSeed() {
            var SEED_ELEMENT_LENGTH_IN_BYTES = 4;
            var SEED_ARRAY_LENGTH = 16;
            var data = crypto.randomBytes(SEED_ARRAY_LENGTH * SEED_ELEMENT_LENGTH_IN_BYTES);
            var seed = [];
            for (var i = 0; i < SEED_ARRAY_LENGTH; i += 1) {
                seed[i] = data.readUIntBE(i * SEED_ELEMENT_LENGTH_IN_BYTES, SEED_ELEMENT_LENGTH_IN_BYTES);
            }
            return seed;
        }

        function generateTicketId() {
            return crypto.randomBytes(20).toString('hex');
        }

        function getEvaluateExpressionRequestBody(requestBody) {
            var evaluateExpressionRequestBody = requestBody.evaluateExpressionRequestBody;
            if (!evaluateExpressionRequestBody.randomNumberGenerator) {
                var randomNumberGenerator = {
                    content: {
                        name: 'uniform',
                        options: {
                            seed: generateRandomNumberGeneratorSeed()
                        }
                    },
                    signature: null
                };
                randomNumberGenerator.signature = security.createSignature(
                    randomNumberGenerator.content,
                    controllerData.privateKey,
                    controllerData.publicKey
                );
                evaluateExpressionRequestBody.randomNumberGenerator = randomNumberGenerator;
            }
            return evaluateExpressionRequestBody;
        }

        function getRedeemTicketUrl(request) {
            return controllerUtils.getRequestRootUrl(request) + controllerData.redeemTicketPath;
        }

        return {
            issueTicket: function (request, response) {
                try {
                    controllerUtils.setSuccessResponse(response, createResponseBody(request));
                } catch (e) {
                    controllerUtils.setFailureResponse(response, e);
                }
            }
        };
    }
};
