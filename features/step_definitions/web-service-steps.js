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

"use strict";

var chai = require("chai");
var request = require("request");

var expect = chai.expect;

module.exports = function () {
    var req = {};
    var res = null;

    this.Given(/^a request with the expression (.+)$/, function (expression) {
        req.expression = expression;
    });

    this.When(/^the evaluate service is invoked$/, function (callback) {
        var requestData = {
            form: req,
            uri: "http://localhost:3000/evaluate"
        };
        request.post(requestData, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                res = JSON.parse(body);
                callback();
            } else {
                callback.fail(new Error("unexpected response from evaluate service"));
            }
        });
    });

    this.Then(/^the response should contain the expression result (\d+)$/, function (expressionResult) {
        expect(res.expressionResult).to.equal(parseInt(expressionResult));
    });
};

