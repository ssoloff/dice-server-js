/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var req = require('request'),
    security = require('../../common/support/security');

function EvaluateExpressionService() {
    this.requestBody = {};
}

EvaluateExpressionService.prototype.call = function (callback) {
    var requestData = {
        body: this.requestBody,
        json: true,
        uri: 'http://localhost:3000/expression/evaluate'
    };
    req.post(requestData, function (error, response, body) {
        if (!error) {
            callback(response.statusCode, body);
        } else {
            throw new Error(error);
        }
    });
};

EvaluateExpressionService.prototype.setExpression = function (expressionText) {
    this.requestBody.expression = {
        text: expressionText
    };
};

EvaluateExpressionService.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    var randomNumberGenerator = {
        content: {
            name: randomNumberGeneratorName
        },
        signature: null
    };
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
    this.requestBody.randomNumberGenerator = randomNumberGenerator;
};

module.exports = EvaluateExpressionService;
