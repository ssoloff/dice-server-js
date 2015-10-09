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

