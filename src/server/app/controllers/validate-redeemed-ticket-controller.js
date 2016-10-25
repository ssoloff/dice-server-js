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
        function createResponseBody(request) {
            validateRequest(request);

            return {};
        }

        function isSignatureValid(content, signature) {
            return security.verifySignature(content, signature, controllerData.publicKey);
        }

        function validateRequest(request) {
            var redeemedTicket = request.body.redeemedTicket;
            if (!isSignatureValid(redeemedTicket.content, redeemedTicket.signature)) {
                throw controllerUtils.createControllerError(
                    httpStatus.BAD_REQUEST,
                    'redeemed ticket signature is invalid'
                );
            }
        }

        return {
            validateRedeemedTicket: function (request, response) {
                try {
                    controllerUtils.setSuccessResponse(response, createResponseBody(request));
                } catch (e) {
                    controllerUtils.setFailureResponse(response, e);
                }
            }
        };
    }
};
