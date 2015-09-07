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
        this.validateRedeemedTicketService = world.createValidateRedeemedTicketService();
        this.response = null;
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
        this.issueTicketService.call(function (res) {
            var issueTicketResponse = res;
            if (!issueTicketResponse.success) {
                throw new Error('failed to issue ticket');
            }

            this.redeemTicketService.setRequestFromIssueTicketResponse(issueTicketResponse);
            this.redeemTicketService.call(function (res) {
                var redeemTicketResponse = res;
                if (!redeemTicketResponse.success) {
                    throw new Error('failed to redeem ticket');
                }

                if (this.redeemedTicket.forceInvalidSignature) {
                    redeemTicketResponse.success.redeemedTicket.content.description += '...'; // change content so signature will not match
                }
                this.validateRedeemedTicketService.setRequestFromRedeemTicketResponse(redeemTicketResponse);
                this.validateRedeemedTicketService.call(function (res) {
                    this.response = res;
                    callback();
                }.bind(runner));
            }.bind(runner));
        }.bind(runner));
    });

    this.Then(/^the response should indicate failure$/, function () {
        // jshint expr: true
        expect(this.response.failure).to.exist;
    });

    this.Then(/^the response should indicate success$/, function () {
        // jshint expr: true
        expect(this.response.success).to.exist;
    });
};

