/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var _ = require('underscore'),
    controllerUtils = require('./support/controller-utils'),
    crypto = require('crypto'),
    security = require('./support/security');

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
            var ticketContent;

            ticketContent = createTicketContent(request);
            return {
                content: ticketContent,
                signature: createSignature(ticketContent)
            };
        }

        function createTicketContent(request) {
            var evaluateExpressionRequestBody,
                evaluateExpressionResponseBody,
                evaluateExpressionResponseStatus,
                evaluateExpressionResult,
                requestBody = request.body;

            evaluateExpressionRequestBody = getEvaluateExpressionRequestBody(requestBody);
            evaluateExpressionResult = evaluateExpression(evaluateExpressionRequestBody);
            evaluateExpressionResponseStatus = evaluateExpressionResult[0];
            if (controllerUtils.isSuccessResponse(evaluateExpressionResponseStatus)) {
                return {
                    description: requestBody.description,
                    evaluateExpressionRequestBody: evaluateExpressionRequestBody,
                    id: generateTicketId(),
                    redeemUrl: getRedeemTicketUrl(request)
                };
            } else {
                evaluateExpressionResponseBody = evaluateExpressionResult[1];
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
            var SEED_ELEMENT_LENGTH_IN_BYTES = 4,
                SEED_ARRAY_LENGTH = 16,
                data = crypto.randomBytes(SEED_ARRAY_LENGTH * SEED_ELEMENT_LENGTH_IN_BYTES),
                seed = [];

            _.times(SEED_ARRAY_LENGTH, function (i) {
                seed[i] = data.readUIntBE(i * SEED_ELEMENT_LENGTH_IN_BYTES, SEED_ELEMENT_LENGTH_IN_BYTES);
            });
            return seed;
        }

        function generateTicketId() {
            return crypto.randomBytes(20).toString('hex');
        }

        function getEvaluateExpressionRequestBody(requestBody) {
            var evaluateExpressionRequestBody = requestBody.evaluateExpressionRequestBody,
                randomNumberGenerator;

            if (!evaluateExpressionRequestBody.randomNumberGenerator) {
                randomNumberGenerator = {
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
