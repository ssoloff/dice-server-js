/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var controllerUtils = require('./support/controller-utils'),
    httpStatus = require('http-status-codes'),
    security = require('./support/security');

module.exports = {
    create: function (controllerData) {
        function createRedeemedTicket(request) {
            var redeemedTicketContent;

            redeemedTicketContent = createRedeemedTicketContent(request);
            return {
                content: redeemedTicketContent,
                signature: createSignature(redeemedTicketContent)
            };
        }

        function createRedeemedTicketContent(request) {
            var evaluateExpressionResponseBody,
                evaluateExpressionResponseStatus,
                evaluateExpressionResult,
                ticketContent = request.body.ticket.content;

            evaluateExpressionResult = evaluateExpression(ticketContent.evaluateExpressionRequestBody);
            evaluateExpressionResponseStatus = evaluateExpressionResult[0];
            evaluateExpressionResponseBody = evaluateExpressionResult[1];
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
