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
        this.redeemTicketService = world.createRedeemTicketService();
        this.response = null;
        this.ticket = {
            description: null,
            id: null
        };
        callback();
    });

    this.Given(/^a ticket with the description "(.*)"$/, function (description) {
        this.issueTicketService.setDescription(description);
    });

    this.Given(/^a ticket with the expression "(.*)"$/, function (expression) {
        this.issueTicketService.setExpression(expression);
    });

    this.Given(/^a ticket with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        this.issueTicketService.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the redeem ticket service is invoked$/, function (callback) {
        var runner = this;
        this.issueTicketService.call(function (res) {
            var issueTicketResponse = res;
            if (!issueTicketResponse.content.success) {
                throw new Error('failed to issue ticket');
            }
            this.ticket.description = issueTicketResponse.content.success.description;
            this.ticket.id = issueTicketResponse.content.success.id;

            this.redeemTicketService.setRequestFromIssueTicketResponse(issueTicketResponse);
            this.redeemTicketService.call(function (res) {
                this.response = res;
                callback();
            }.bind(runner));
        }.bind(runner));
    });

    this.Then(/^the response should be signed$/, function () {
        // jshint expr: true
        expect(this.response.signature).to.exist;
    });

    this.Then(/^the response should contain a failure$/, function () {
        // jshint expr: true
        expect(this.response.content.failure).to.exist;
    });

    this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
        expect(this.response.content.success.evaluateResponse.expressionResult.text).to.equal(expressionResultText);
    });

    this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
        expect(this.response.content.success.evaluateResponse.expressionResult.value).to.equal(parseFloat(expressionResultValue));
    });

    this.Then(/^the response should contain the ticket description$/, function () {
        expect(this.response.content.success.description).to.equal(this.ticket.description);
    });

    this.Then(/^the response should contain the ticket identifier$/, function () {
        expect(this.response.content.success.id).to.equal(this.ticket.id);
    });
};

