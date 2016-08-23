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

var ControllerError = require('./controller-error');
var httpStatus = require('http-status-codes');

module.exports = {
    createControllerError: function (status, message) {
        return new ControllerError(status, message);
    },

    createControllerErrorFromResponse: function (responseStatus, responseBody) {
        var message = responseBody.error ? responseBody.error.message : null;

        return new ControllerError(responseStatus, message);
    },

    getRequestRootUrl: function (request) {
        return request.protocol + '://' + request.get('host');
    },

    isSuccessResponse: function (responseStatus) {
        return responseStatus === httpStatus.OK;
    },

    postJson: function (callback, requestBody) {
        var request,
            response,
            responseBody,
            responseStatus;

        request = {
            body: requestBody
        };
        response = {
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
        var responseBody;

        if (e instanceof ControllerError) {
            response.status(e.status);
        } else {
            response.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        responseBody = {
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
