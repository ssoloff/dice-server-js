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

var _ = require('underscore');
var fs = require('fs');
var ja = require('json-assert');
var path = require('path');
var security = require('../../../controllers/support/security');

/**
 * Provides useful methods for testing a dice server controller.
 *
 * @module controller-test
 */
module.exports = {
    /**
     * Creates a new request for a controller.
     *
     * @param {Object!} body - The request body.
     *
     * @returns {Object!} A new request.
     */
    createRequest: function (body) {
        return {
            body: body,
            get: function () {
                return 'host:1234';
            },
            protocol: 'http'
        };
    },

    /**
     * Creates a new response for a controller.
     *
     * @param {Function!} jsonCallback - The callback to invoke when the JSON
     *      associated with the response is set.  This callback accepts a
     *      single parameter that contains the JSON.
     *
     * @returns {Object!} A new response.
     */
    createResponse: function (jsonCallback) {
        var response = {
            json: function (json) {
                jsonCallback(json);
                return this;
            },
            status: function () {
                return this;
            }
        };
        spyOn(response, 'json').and.callThrough();
        spyOn(response, 'status').and.callThrough();
        return response;
    },

    /**
     * Creates a detached JSON web signature for the specified request/response
     * content.
     *
     * <p>
     * The returned JSON web signature uses the flattened JWS JSON
     * serialization.  It does not include the payload as it is a
     * detached signature.
     * </p>
     *
     * @param {Object!} content - The request/response content.
     *
     * @returns {Object!} The detached JSON web signature.
     */
    createSignature: function (content) {
        return security.createSignature(content, this.getPrivateKey(), this.getPublicKey());
    },

    /**
     * Returns the private key to be used by secure controllers.
     *
     * @returns {Object!} The private key to be used by secure controllers.
     */
    getPrivateKey: function () {
        return fs.readFileSync(path.join(__dirname, '../../../test/private-key.pem'));
    },

    /**
     * Returns the public key to be used by secure controllers.
     *
     * @returns {Object!} The public key to be used by secure controllers.
     */
    getPublicKey: function () {
        return fs.readFileSync(path.join(__dirname, '../../../test/public-key.pem'));
    },

    /**
     * Indicates the actual response body equals the expected response body.
     *
     * <p>
     * This method implements the interface for a Jasmine custom equality
     * tester.
     * </p>
     *
     * @param {Object} actual - The actual response body.
     * @param {Object} expected - The expected response body.
     *
     * @returns {Boolean} `true` if `actual` equals `expected`; `false` if
     *      `actual` does not equal `expected`; or `undefined` if both `actual`
     *      and `expected` are not response body objects.
     */
    isResponseBodyEqual: function (actual, expected) {
        if ((_.has(actual, 'success') || _.has(actual, 'failure')) &&
                (_.has(expected, 'success') || _.has(expected, 'failure'))) {
            return ja.isEqual(expected, actual, true);
        }
    }
};

