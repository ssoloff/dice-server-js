/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var req = require('request');
var security = require('../../support/security');

function IssueTicketService() {
    this.requestBody = {
        evaluateExpressionRequestBody: {}
    };
}

IssueTicketService.prototype.call = function (callback) {
    var requestData = {
        body: this.requestBody,
        json: true,
        uri: 'http://localhost:3000/ticket/issue'
    };
    req.post(requestData, function (error, response, body) {
        if (!error) {
            callback(response.statusCode, body);
        } else {
            throw new Error(error);
        }
    });
};

IssueTicketService.prototype.setDescription = function (description) {
    this.requestBody.description = description;
};

IssueTicketService.prototype.setExpression = function (expressionText) {
    this.requestBody.evaluateExpressionRequestBody.expression = {
        text: expressionText
    };
};

IssueTicketService.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    var randomNumberGenerator = {
        content: {
            name: randomNumberGeneratorName
        },
        signature: null
    };
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
    this.requestBody.evaluateExpressionRequestBody.randomNumberGenerator = randomNumberGenerator;
};

module.exports = IssueTicketService;
