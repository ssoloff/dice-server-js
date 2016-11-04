/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const ControllerError = require('./controller-error');
const httpStatus = require('http-status-codes');

module.exports = {
    createControllerError: function (status, message) {
        return new ControllerError(status, message);
    },

    createControllerErrorFromResponse: function (responseStatus, responseBody) {
        const message = responseBody.error ? responseBody.error.message : null;
        return new ControllerError(responseStatus, message);
    },

    getRequestRootUrl: function (request) {
        return request.protocol + '://' + request.get('host');
    },

    isSuccessResponse: function (responseStatus) {
        return responseStatus === httpStatus.OK;
    },

    postJson: function (callback, requestBody) {
        let responseBody;
        let responseStatus;
        const request = {
            body: requestBody
        };
        const response = {
            json: function (json) {
                responseBody = json;
                return this;
            },
            status: function (status) {
                responseStatus = status;
                return this;
            }
        };
        callback(request, response);
        return [responseStatus, responseBody];
    },

    setFailureResponse: function (response, e) {
        if (e instanceof ControllerError) {
            response.status(e.status);
        } else {
            response.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        const responseBody = {
            error: {
                message: e.message
            }
        };
        response.json(responseBody);
    },

    setSuccessResponse: function (response, responseBody) {
        response.status(httpStatus.OK).json(responseBody);
    }
};
