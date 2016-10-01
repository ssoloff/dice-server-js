/*
 * Copyright (c) 2016 Steven Soloff
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

var webdriver = require('selenium-webdriver');
var security = require('../../support/security');

var By = webdriver.By,
    until = webdriver.until;

function HomePage(driver) {
    this.driver = driver;
}

HomePage.prototype.clearExpressionText = function () {
    return this.driver.findElement(By.id('main-expressionText')).clear();
};

HomePage.prototype.evaluate = function () {
    return this.driver.findElement(By.id('main-evaluate')).click();
};

HomePage.prototype.getErrorMessage = function () {
    return this.driver.findElement(By.id('main-errorMessage')).getText();
};

HomePage.prototype.getExpressionCanonicalTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(2)'))
        .getText();
};

HomePage.prototype.getExpressionResultCount = function () {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElements(By.css('tr'))
        .then(function (elements) {
            return elements.length;
        });
};

HomePage.prototype.getExpressionResultTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(3)'))
        .getText();
};

HomePage.prototype.getExpressionResultValueAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(4)'))
        .getText();
};

HomePage.prototype.getExpressionTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(1)'))
        .getText();
};

HomePage.prototype.getHelpLinkText = function () {
    return this.driver.findElement(By.id('main-toggleHelp')).getText();
};

HomePage.prototype.isErrorMessageDisplayed = function () {
    return this.driver.findElement(By.id('main-errorMessage')).isDisplayed();
};

HomePage.prototype.open = function () {
    return this.driver.get('http://localhost:3000/');
};

HomePage.prototype.reevaluateResultAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(5)'))
        .findElement(By.name('reevaluate'))
        .click();
};

HomePage.prototype.removeAllResults = function () {
    return this.driver.findElement(By.id('main-removeAllResults')).click();
};

HomePage.prototype.removeResultAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(5)'))
        .findElement(By.name('remove'))
        .click();
};

HomePage.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    var randomNumberGenerator = {
        content: {
            name: randomNumberGeneratorName
        },
        signature: null
    };
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
    return this.driver.executeScript(
        "$('#main-randomNumberGeneratorJson').val('" +
        JSON.stringify(randomNumberGenerator) +
        "');"
    );
};

HomePage.prototype.setRoundingMode = function (roundingMode) {
    return this.driver.findElement(By.id('main-roundingMode' + roundingMode)).click();
};

HomePage.prototype.toggleHelp = function () {
    return this.driver.findElement(By.id('main-toggleHelp')).click();
};

HomePage.prototype.typeExpressionText = function (expressionText) {
    return this.driver.findElement(By.id('main-expressionText')).sendKeys(expressionText);
};

HomePage.prototype.waitUntilHelpIsDisplayed = function () {
    return this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('main-help'))), 5000).then(function (element) {
        return element.isDisplayed();
    });
};

HomePage.prototype.waitUntilHelpIsNotDisplayed = function () {
    return this.driver.wait(until.elementIsNotVisible(this.driver.findElement(By.id('main-help'))), 5000).then(function (element) {
        return element.isDisplayed();
    });
};

module.exports = HomePage;
