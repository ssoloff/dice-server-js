/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const webdriver = require('selenium-webdriver');
const security = require('../../../common/support/security');

const By = webdriver.By;
const promise = webdriver.promise;
const until = webdriver.until;

function HomePage(driver) {
    this.driver = driver;
}

HomePage.prototype.clearExpressionText = function () {
    return this.driver.findElement(By.id('main-eval-expressionText')).clear();
};

HomePage.prototype.evaluate = function () {
    return this.driver.findElement(By.id('main-eval-evaluate')).click();
};

HomePage.prototype.getErrorMessage = function () {
    return this.driver.findElement(By.id('main-eval-errorMessage')).getText();
};

HomePage.prototype.getExpressionCanonicalTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(2)'))
        .getText();
};

HomePage.prototype.getExpressionResultCount = function () {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElements(By.css('tr'))
        .then((elements) => elements.length);
};

HomePage.prototype.getExpressionResultTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(3)'))
        .getText();
};

HomePage.prototype.getExpressionResultValueAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(4)'))
        .getText();
};

HomePage.prototype.getExpressionTextAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(1)'))
        .getText();
};

HomePage.prototype.getHelpLinkText = function () {
    return this.driver.findElement(By.id('main-eval-toggleHelp')).getText();
};

HomePage.prototype.isErrorMessageDisplayed = function () {
    return this.driver.findElement(By.id('main-eval-errorMessage')).isDisplayed();
};

HomePage.prototype.open = function () {
    const driver = this.driver;
    return driver.get('http://localhost:3000/').then(() => {
        // wait for async load of all feature fragments to complete
        const timeoutInMilliseconds = 60000;
        return promise.all([
            driver.wait(until.elementLocated(By.id('main-eval-expressionForm')), timeoutInMilliseconds),
            driver.wait(until.elementLocated(By.id('main-history-removeAllResults')), timeoutInMilliseconds),
            driver.wait(until.elementLocated(By.id('main-sim-dieRollResults')), timeoutInMilliseconds)
        ]);
    });
};

HomePage.prototype.reevaluateResultAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(5)'))
        .findElement(By.name('reevaluate'))
        .click();
};

HomePage.prototype.removeAllResults = function () {
    return this.driver.findElement(By.id('main-history-removeAllResults')).click();
};

HomePage.prototype.removeResultAtIndex = function (index) {
    return this.driver
        .findElement(By.id('main-history-expressionResults'))
        .findElement(By.css('tr:nth-child(' + index + ') td:nth-child(5)'))
        .findElement(By.name('remove'))
        .click();
};

HomePage.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    const randomNumberGenerator = {
        content: {
            name: randomNumberGeneratorName
        },
        signature: null
    };
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
    return this.driver.executeScript(
        "$('#main-eval-randomNumberGeneratorJson').val('" +
        JSON.stringify(randomNumberGenerator) +
        "');"
    );
};

HomePage.prototype.setRoundingMode = function (roundingMode) {
    return this.driver.findElement(By.id('main-eval-roundingMode' + roundingMode)).click();
};

HomePage.prototype.toggleHelp = function () {
    return this.driver.findElement(By.id('main-eval-toggleHelp')).click();
};

HomePage.prototype.typeExpressionText = function (expressionText) {
    return this.driver.findElement(By.id('main-eval-expressionText')).sendKeys(expressionText);
};

HomePage.prototype.waitUntilHelpIsDisplayed = function () {
    return this.driver
        .wait(until.elementIsVisible(this.driver.findElement(By.id('main-eval-help'))), 5000)
        .then((element) => element.isDisplayed());
};

HomePage.prototype.waitUntilHelpIsNotDisplayed = function () {
    return this.driver
        .wait(until.elementIsNotVisible(this.driver.findElement(By.id('main-eval-help'))), 5000)
        .then((element) => element.isDisplayed());
};

module.exports = HomePage;
