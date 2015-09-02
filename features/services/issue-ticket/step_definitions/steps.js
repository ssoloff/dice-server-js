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

var chai = require('chai');
var world = require('../support/world');

var expect = chai.expect;

module.exports = function () {
    this.World = world.World;

    this.Before(function (callback) {
        this.issueTicketService = world.createIssueTicketService();
        this.response = null;
        callback();
    });

    this.Given(/^a request with the description "(.*)"$/, function (description) {
        this.issueTicketService.setDescription(description);
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.issueTicketService.setExpression(expression);
    });

    this.When(/^the issue ticket service is invoked$/, function (callback) {
        this.issueTicketService.call(function (res) {
            this.response = res;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should be signed$/, function () {
        // jshint expr: true
        expect(this.response.signature).to.exist;
    });

    this.Then(/^the response should contain a failure$/, function () {
        // jshint expr: true
        expect(this.response.content.failure).to.exist;
    });

    this.Then(/^the response should contain a ticket identifier$/, function () {
        expect(this.response.content.success.id).to.match(/^[0-9A-Fa-f]{40}$/);
    });

    this.Then(/^the response should contain the description "(.*)"$/, function (description) {
        expect(this.response.content.success.description).to.equal(description);
    });

    this.Then(/^the response should contain the expression text "(.*)"$/, function (expressionText) {
        expect(this.response.content.success.evaluateRequest.expression.text).to.equal(expressionText);
    });
};

