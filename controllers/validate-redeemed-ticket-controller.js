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

var httpStatus = require('http-status-codes');
var security = require('./security');

module.exports = {
    create: function (publicKey) {
        function createResponse(request) {
            try {
                validateRequest(request);

                return {
                    success: {}
                };
            } catch (e) {
                return {
                    failure: {
                        message: e.message
                    }
                };
            }
        }

        function isSignatureValid(content, signature) {
            return security.verifySignature(content, signature, publicKey);
        }

        function validateRequest(request) {
            var redeemedTicket = request.redeemedTicket;
            if (!isSignatureValid(redeemedTicket.content, redeemedTicket.signature)) {
                throw new Error('redeemed ticket signature is invalid');
            }
        }

        return {
            validateRedeemedTicket: function (req, res) {
                var request = req.body;
                var response = createResponse(request);
                res.status(httpStatus.OK).json(response);
            }
        };
    }
};

