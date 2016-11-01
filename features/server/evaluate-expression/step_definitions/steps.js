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
        this.evaluateExpressionService = this.createEvaluateExpressionService();
        this.response = {
            body: null,
            status: null
        };
        callback();
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.evaluateExpressionService.setExpression(expression);
    });

    this.Given(/^a request with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        this.evaluateExpressionService.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the evaluate expression service is invoked$/, function (callback) {
        this.evaluateExpressionService.call(function (responseStatus, responseBody) {
            this.response.status = responseStatus;
            this.response.body = responseBody;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should be$/, function (jsonResponse) {
        expect(this.response.body).to.deep.equal(JSON.parse(jsonResponse));
    });

    this.Then(/^the response should contain the die roll results "(.*)"$/, function (jsonDieRollResults) {
        expect(this.response.body.dieRollResults).to.deep.equal(JSON.parse(jsonDieRollResults));
    });

    this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
        expect(this.response.body.expressionResult.text).to.equal(expressionResultText);
    });

    this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
        expect(this.response.body.expressionResult.value).to.equal(parseFloat(expressionResultValue));
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