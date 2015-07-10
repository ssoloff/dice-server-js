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
        this.homePage = world.createHomePage();
        callback();
    });

    this.Given(/^the home page is open$/, function () {
        return this.homePage.open();
    });

    this.Given(/^the random number generator name is "(.*)"$/, function (randomNumberGeneratorName) {
        return this.homePage.setRandomNumberGenerator(randomNumberGeneratorName);
    });

    this.When(/^the ENTER key is pressed$/, function () {
        return this.homePage.typeExpressionText('\n');
    });

    this.When(/^the expression "(.*)" is entered$/, function (expression) {
        return this.homePage.typeExpressionText(expression);
    });

    this.When(/^the expression "(.*)" is evaluated$/, function (expression) {
        this.homePage.clearExpressionText();
        this.homePage.typeExpressionText(expression);
        return this.homePage.evaluate();
    });

    this.When(/^the(?: hide)? help link is clicked$/, function () {
        return this.homePage.toggleHelp();
    });

    this.When(/^the reevaluate button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function (index) {
        return this.homePage.reevaluateResultAtIndex(index);
    });

    this.When(/^the remove all button is clicked$/, function () {
        return this.homePage.removeAllResults();
    });

    this.When(/^the remove button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function (index) {
        return this.homePage.removeResultAtIndex(index);
    });

    this.When(/^the rounding mode is "(.*)"$/, function (roundingMode) {
        return this.homePage.setRoundingMode(roundingMode);
    });

    this.Then(/^an error message should be displayed$/, function () {
        this.homePage.isErrorMessageDisplayed().then(function (isDisplayed) {
            expect(isDisplayed).to.be.true;
        });
        return this.homePage.getErrorMessage().then(function (text) {
            expect(text).to.have.length.above(0);
        });
    });

    this.Then(/^an error message should not be displayed$/, function () {
        return this.homePage.isErrorMessageDisplayed().then(function (isDisplayed) {
            expect(isDisplayed).to.be.false;
        });
    });

    this.Then(/^help should( not)? be displayed$/, function (negate) {
        if (negate) {
            this.homePage.waitUntilHelpIsNotDisplayed().then(function (isNotDisplayed) {
                expect(isNotDisplayed).to.be.true;
            });
        } else {
            this.homePage.waitUntilHelpIsDisplayed().then(function (isDisplayed) {
                expect(isDisplayed).to.be.true;
            });
        }
    });

    this.Then(/^the (\d+)(?:st|nd|rd|th) expression canonical text should be "(.*)"$/, function (index, expressionCanonicalText) {
        return this.homePage.getExpressionCanonicalTextAtIndex(Number(index)).then(function (text) {
            expect(text).to.equal(expressionCanonicalText);
        });
    });

    this.Then(/^the (\d+)(?:st|nd|rd|th) expression text should be "(.*)"$/, function (index, expressionText) {
        return this.homePage.getExpressionTextAtIndex(Number(index)).then(function (text) {
            expect(text).to.equal(expressionText);
        });
    });

    this.Then(/^the (\d+)(?:st|nd|rd|th) expression result text should be "(.*)"$/, function (index, expressionResultText) {
        return this.homePage.getExpressionResultTextAtIndex(Number(index)).then(function (text) {
            expect(text).to.equal(expressionResultText);
        });
    });

    this.Then(/^the (\d+)(?:st|nd|rd|th) expression result value should be "(.*)"$/, function (index, expressionResultValue) {
        return this.homePage.getExpressionResultValueAtIndex(Number(index)).then(function (text) {
            expect(text).to.equal(expressionResultValue);
        });
    });

    this.Then(/^the help link text should be "(.*)"$/, function (helpLinkText) {
        return this.homePage.getHelpLinkText().then(function (text) {
            expect(text).to.equal(helpLinkText);
        });
    });

    this.Then(/^the results table should be empty$/, function () {
        return this.homePage.getExpressionResultCount().then(function (expressionResultCount) {
            expect(expressionResultCount).to.equal(0);
        });
    });
};

