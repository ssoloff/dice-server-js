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
var world = require('../support/world');

var expect = chai.expect;

module.exports = function () {
    this.World = world.World;

    this.Before(function (scenario, callback) {
        this.issueTicketService = world.createIssueTicketService();
        this.redeemTicketService = world.createRedeemTicketService();
        this.response = {
            body: null,
            status: null
        };
        this.previousResponse = null;
        this.ticket = {
            description: null,
            forceInvalidSignature: false,
            forceRedeemed: false,
            id: null
        };
        callback();
    });

    this.Given(/^a ticket$/, function () {
        this.issueTicketService.setExpression('3d6');
        this.issueTicketService.setDescription('description');
    });

    this.Given(/^a ticket that has already been redeemed$/, function () {
        this.issueTicketService.setExpression('3d6');
        this.issueTicketService.setDescription('description');
        this.ticket.forceRedeemed = true;
    });

    this.Given(/^a ticket with an invalid signature$/, function () {
        this.issueTicketService.setExpression('3d6');
        this.issueTicketService.setDescription('description');
        this.ticket.forceInvalidSignature = true;
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
        this.issueTicketService.call(function (responseStatus, responseBody) {
            if (responseStatus !== httpStatus.OK) {
                throw new Error('failed to issue ticket');
            }
            var issueTicketResponseBody = responseBody;

            this.ticket.description = issueTicketResponseBody.ticket.content.description;
            this.ticket.id = issueTicketResponseBody.ticket.content.id;

            if (this.ticket.forceInvalidSignature) {
                issueTicketResponseBody.ticket.content.description += '...'; // change content so signature will not match
            }
            this.redeemTicketService.setRequestFromIssueTicketResponseBody(issueTicketResponseBody);

            var redeemTicketServiceResponseHandler = function (responseStatus, responseBody) {
                this.response.status = responseStatus;
                this.response.body = responseBody;
                callback();
            }.bind(runner);
            if (this.ticket.forceRedeemed) {
                this.redeemTicketService.call(function () {
                    this.previousResponse = this.response;
                    this.redeemTicketService.call(redeemTicketServiceResponseHandler);
                }.bind(runner));
            } else {
                this.redeemTicketService.call(redeemTicketServiceResponseHandler);
            }
        }.bind(runner));
    });

    this.Then(/^the response should contain a link to the validate redeemed ticket service$/, function () {
        // jshint expr: true
        expect(this.response.body.redeemedTicket.content.validateUrl).to.exist;
    });

    this.Then(/^the response should contain a signed redeemed ticket$/, function () {
        // jshint expr: true
        expect(this.response.body.redeemedTicket.signature).to.exist;
    });

    this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
        expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.text).to.equal(expressionResultText);
    });

    this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
        expect(this.response.body.redeemedTicket.content.evaluateExpressionResponseBody.expressionResult.value).to.equal(parseFloat(expressionResultValue));
    });

    this.Then(/^the response should contain the ticket description$/, function () {
        expect(this.response.body.redeemedTicket.content.description).to.equal(this.ticket.description);
    });

    this.Then(/^the response should contain the ticket identifier$/, function () {
        expect(this.response.body.redeemedTicket.content.id).to.equal(this.ticket.id);
    });

    this.Then(/^the response should equal the previous response$/, function () {
        expect(this.response).to.equal(this.previousResponse);
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

