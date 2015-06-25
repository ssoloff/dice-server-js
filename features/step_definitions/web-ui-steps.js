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
var HomePage = require("../support/home-page");
var world = require("../support/world");

var expect = chai.expect;

module.exports = function () {
    var homePage = new HomePage(world.getDriver());

    this.World = world.World;

    this.Given(/^the home page is open$/, function () {
        return homePage.open();
    });

    this.When(/^an empty expression is evaluated$/, function () {
        homePage.clearExpression();
        return homePage.evaluate();
    });

    this.When(/^the ENTER key is pressed$/, function () {
        return homePage.typeExpression("\n");
    });

    this.When(/^the expression (.+) is entered$/, function (expression) {
        return homePage.typeExpression(expression);
    });

    this.When(/^the expression (.+) is evaluated$/, function (expression) {
        homePage.clearExpression();
        homePage.typeExpression(expression);
        return homePage.evaluate();
    });

    this.Then(/^an error message should be displayed$/, function () {
        homePage.isErrorMessageDisplayed().then(function (isDisplayed) {
            expect(isDisplayed).to.be.true;
        });
        return homePage.getErrorMessage().then(function (text) {
            expect(text).to.have.length.above(0);
        });
    });

    this.Then(/^an error message should not be displayed$/, function () {
        return homePage.isErrorMessageDisplayed().then(function (isDisplayed) {
            expect(isDisplayed).to.be.false;
        });
    });

    this.Then(/^the expression result value should be (\d+)$/, function (expressionResultValue) {
        return homePage.getExpressionResultValue().then(function (text) {
            expect(text).to.equal(expressionResultValue);
        });
    });

    this.Then(/^the expression result value should be empty$/, function () {
        return homePage.getExpressionResultValue().then(function (text) {
            expect(text).to.be.empty;
        });
    });
};

