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
var httpStatus = require('http-status-codes');

var expect = chai.expect;

module.exports = function () {
    this.Before(function (scenario, callback) {
        this.issueTicketService = this.createIssueTicketService();
        this.response = {
            body: null,
            status: null
        };
        callback();
    });

    this.Given(/^a request with the description "(.*)"$/, function (description) {
        this.issueTicketService.setDescription(description);
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.issueTicketService.setExpression(expression);
    });

    this.Given(/^a request with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        this.issueTicketService.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the issue ticket service is invoked$/, function (callback) {
        this.issueTicketService.call(function (responseStatus, responseBody) {
            this.response.status = responseStatus;
            this.response.body = responseBody;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should contain a link to the redeem ticket service$/, function () {
        // jshint expr: true
        expect(this.response.body.ticket.content.redeemUrl).to.exist;
    });

    this.Then(/^the response should contain a signed ticket$/, function () {
        // jshint expr: true
        expect(this.response.body.ticket.signature).to.exist;
    });

    this.Then(/^the response should contain a ticket identifier$/, function () {
        expect(this.response.body.ticket.content.id).to.match(/^[0-9A-Fa-f]{40}$/);
    });

    this.Then(/^the response should contain the description "(.*)"$/, function (description) {
        expect(this.response.body.ticket.content.description).to.equal(description);
    });

    this.Then(/^the response should contain the expression text "(.*)"$/, function (expressionText) {
        expect(this.response.body.ticket.content.evaluateExpressionRequestBody.expression.text).to.equal(expressionText);
    });

    this.Then(/^the response should contain the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        expect(this.response.body.ticket.content.evaluateExpressionRequestBody.randomNumberGenerator.content.name).to.equal(randomNumberGeneratorName);
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

