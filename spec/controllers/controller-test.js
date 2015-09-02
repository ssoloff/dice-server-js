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

/**
 * Provides useful methods for testing a dice server controller.
 *
 * @module controller-test
 */
module.exports = {
    /**
     * Creates a new request for a controller.
     *
     * @param {Object!} request - The request body.
     *
     * @returns {Object!} A new request.
     */
    createRequest: function (request) {
        return {
            body: request
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
        var res = {
            json: function (json) {
                jsonCallback(json);
                return this;
            },
            status: function () {
                return this;
            }
        };
        spyOn(res, 'json').and.callThrough();
        spyOn(res, 'status').and.callThrough();
        return res;
    },

    /**
     * Indicates the actual response content equals the expected response
     * content.
     *
     * <p>
     * This method implements the interface for a Jasmine custom equality
     * tester.
     * </p>
     *
     * @param {Object} actual - The actual response content.
     * @param {Object} expected - The expected response content.
     *
     * @returns {Boolean} `true` if `actual` equals `expected`; `false` if
     *      `actual` does not equal `expected`; or `undefined` if both `actual`
     *      and `expected` are not response content objects.
     */
    isResponseContentEqual: function (actual, expected) {
        if ((_.has(actual, 'success') || _.has(actual, 'failure')) &&
                (_.has(expected, 'success') || _.has(expected, 'failure'))) {
            return ja.isEqual(expected, actual, true);
        }
    },

    /**
     * Sets the public and private keys for the specified controller.
     *
     * @param {Object!} controller - The controller.
     */
    setKeys: function (controller) {
        controller.setKeys(
            fs.readFileSync(path.join(__dirname, '../../test/private-key.pem')),
            fs.readFileSync(path.join(__dirname, '../../test/public-key.pem'))
        );
    }
};

