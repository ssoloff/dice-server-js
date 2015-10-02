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
        this.evaluateExpressionService = world.createEvaluateExpressionService();
        this.responseBody = null;
        callback();
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.evaluateExpressionService.setExpression(expression);
    });

    this.Given(/^a request with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        this.evaluateExpressionService.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the evaluate expression service is invoked$/, function (callback) {
        this.evaluateExpressionService.call(function (responseBody) {
            this.responseBody = responseBody;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should be$/, function (jsonResponse) {
        expect(this.responseBody).to.deep.equal(JSON.parse(jsonResponse));
    });

    this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
        expect(this.responseBody.success.expressionResult.text).to.equal(expressionResultText);
    });

    this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
        expect(this.responseBody.success.expressionResult.value).to.equal(parseFloat(expressionResultValue));
    });

    this.Then(/^the response should indicate failure$/, function () {
        // jshint expr: true
        expect(this.responseBody.failure).to.exist;
    });
};

