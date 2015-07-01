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

"use strict";

var chai = require("chai");
var world = require("../support/world");

var expect = chai.expect;

module.exports = function () {
    this.World = world.World;

    this.Before(function (callback) {
        this.evaluateService = world.createEvaluateService();
        this.response = null;
        callback();
    });

    this.Given(/^a request with the expression "(.*)"$/, function (expression) {
        this.evaluateService.setExpression(expression);
    });

    this.Given(/^a request with the random number generator named "(.*)"$/, function (randomNumberGeneratorName) {
        this.evaluateService.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the evaluate service is invoked$/, function (callback) {
        this.evaluateService.call(function (res) {
            this.response = res;
            callback();
        }.bind(this));
    });

    this.Then(/^the response should be$/, function (jsonResponse) {
        expect(this.response).to.deep.equal(JSON.parse(jsonResponse));
    });

    this.Then(/^the response should contain the expression result text "(.*)"$/, function (expressionResultText) {
        expect(this.response.expressionResult.text).to.equal(expressionResultText);
    });

    this.Then(/^the response should contain the expression result value (.+)$/, function (expressionResultValue) {
        expect(this.response.expressionResult.value).to.equal(parseFloat(expressionResultValue));
    });
};

