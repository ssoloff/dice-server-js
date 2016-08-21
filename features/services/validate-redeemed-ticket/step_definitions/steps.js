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
        this.issueTicketService = this.createIssueTicketService();
        this.redeemTicketService = this.createRedeemTicketService();
        this.validateRedeemedTicketService = this.createValidateRedeemedTicketService();
        this.response = {
            body: null,
            status: null
        };
        this.redeemedTicket = {
            forceInvalidSignature: false
        };
        callback();
    });

    this.Given(/^a redeemed ticket$/, function () {
        this.issueTicketService.setExpression('42');
        this.issueTicketService.setDescription('description');
    });

    this.Given(/^a redeemed ticket with an invalid signature$/, function () {
        this.issueTicketService.setExpression('42');
        this.issueTicketService.setDescription('description');
        this.redeemedTicket.forceInvalidSignature = true;
    });

    this.When(/^the validate redeemed ticket service is invoked$/, function (callback) {
        var runner = this;
        this.issueTicketService.call(function (responseStatus, responseBody) {
            if (responseStatus !== httpStatus.OK) {
                throw new Error('failed to issue ticket');
            }
            var issueTicketResponseBody = responseBody;

            this.redeemTicketService.setRequestFromIssueTicketResponseBody(issueTicketResponseBody);
            this.redeemTicketService.call(function (responseStatus, responseBody) {
                if (responseStatus !== httpStatus.OK) {
                    throw new Error('failed to redeem ticket');
                }
                var redeemTicketResponseBody = responseBody;

                if (this.redeemedTicket.forceInvalidSignature) {
                    redeemTicketResponseBody.redeemedTicket.content.description += '...'; // change content so signature will not match
                }
                this.validateRedeemedTicketService.setRequestFromRedeemTicketResponseBody(redeemTicketResponseBody);
                this.validateRedeemedTicketService.call(function (responseStatus, responseBody) {
                    this.response.status = responseStatus;
                    this.response.body = responseBody;
                    callback();
                }.bind(runner));
            }.bind(runner));
        }.bind(runner));
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
