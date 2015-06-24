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

    this.When(/^the ENTER key is pressed$/, function () {
        return homePage.setExpression("\n");
    });

    this.When(/^the expression (.+) is entered$/, function (expression) {
        return homePage.setExpression(expression);
    });

    this.When(/^the expression (.+) is evaluated$/, function (expression) {
        homePage.setExpression(expression);
        return homePage.evaluate();
    });

    this.Then(/^the result should be (\d+)$/, function (expressionResult, callback) {
        homePage.getExpressionResult().then(function (text) {
            expect(text).to.equal(expressionResult);
            callback();
        });
    });
};

