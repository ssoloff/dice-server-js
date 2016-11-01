/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var chai = require('chai'),
    httpStatus = require('http-status-codes'),
    expect = chai.expect;

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
            var issueTicketResponseBody = responseBody;

            if (responseStatus !== httpStatus.OK) {
                throw new Error('failed to issue ticket');
            }

            this.redeemTicketService.setRequestFromIssueTicketResponseBody(issueTicketResponseBody);
            this.redeemTicketService.call(function (responseStatus, responseBody) {
                var redeemTicketResponseBody = responseBody;

                if (responseStatus !== httpStatus.OK) {
                    throw new Error('failed to redeem ticket');
                }

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