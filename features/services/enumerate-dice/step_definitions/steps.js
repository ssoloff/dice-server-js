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

var chai = require('chai');
var httpStatus = require('http-status-codes');

var expect = chai.expect;

module.exports = function () {
    this.Before(function (scenario, callback) {
        this.enumerateDiceService = this.createEnumerateDiceService();
        this.response = {
            body: null,
            status: null
        };
        callback();
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.enumerateDiceService.setExpression(expression);
    });

    this.When(/^the enumerate dice service is invoked$/, function (callback) {
        this.enumerateDiceService.call(function (responseStatus, responseBody) {
            this.response.status = responseStatus;
            this.response.body = responseBody;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should contain the dice "(.*)"$/, function (encodedDiceSides) {
        var diceSides = [];

        if (encodedDiceSides) {
            diceSides = encodedDiceSides.split(',').map(function (x) {
                return parseInt(x, 10);
            });
        }
        expect(this.response.body.dice).to.deep.equal(diceSides);
    });

    this.Then(/^the response should indicate failure$/, function () {
        expect(this.response.status).to.not.equal(httpStatus.OK);
        // jshint expr: true
        expect(this.response.body.error).to.exist;
    });

    this.Then(/^the response should indicate success$/, function () {
        expect(this.response.status).to.equal(httpStatus.OK);
    });
};
