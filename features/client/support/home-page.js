/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const webdriver = require('selenium-webdriver');
const security = require('../../common/support/security');

const By = webdriver.By;
const promise = webdriver.promise;
const until = webdriver.until;

class HomePage {
    constructor(driver) {
        this.driver = driver;
    }

    clearExpressionText() {
        return this.driver.findElement(By.id('main-eval-expressionText')).clear();
    }

    evaluate() {
        return this.driver.findElement(By.id('main-eval-evaluate')).click();
    }

    getErrorMessage() {
        return this.driver.findElement(By.id('main-eval-errorMessage')).getText();
    }

    getExpressionCanonicalTextAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(2)`))
            .getText();
    }

    getExpressionResultCount() {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElements(By.css('tr'))
            .then((elements) => elements.length);
    }

    getExpressionResultTextAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(3)`))
            .getText();
    }

    getExpressionResultValueAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(4)`))
            .getText();
    }

    getExpressionTextAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(1)`))
            .getText();
    }

    getHelpLinkText() {
        return this.driver.findElement(By.id('main-eval-toggleHelp')).getText();
    }

    isErrorMessageDisplayed() {
        return this.driver.findElement(By.id('main-eval-errorMessage')).isDisplayed();
    }

    open() {
        const driver = this.driver;
        return driver.get('http://localhost:3000/').then(() => {
            // wait for async load of all feature fragments to complete
            const timeoutInMilliseconds = 60000;
            return promise.all([
                driver.wait(until.elementLocated(By.id('main-eval-expressionForm')), timeoutInMilliseconds),
                driver.wait(until.elementLocated(By.id('main-history-removeAllResults')), timeoutInMilliseconds),
                driver.wait(until.elementLocated(By.id('main-sim-dieRollResults')), timeoutInMilliseconds),
            ]);
        });
    }

    reevaluateResultAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(5)`))
            .findElement(By.name('reevaluate'))
            .click();
    }

    removeAllResults() {
        return this.driver.findElement(By.id('main-history-removeAllResults')).click();
    }

    removeResultAtIndex(index) {
        return this.driver
            .findElement(By.id('main-history-expressionResults'))
            .findElement(By.css(`tr:nth-child(${index}) td:nth-child(5)`))
            .findElement(By.name('remove'))
            .click();
    }

    setRandomNumberGenerator(randomNumberGeneratorName) {
        const randomNumberGenerator = {
            content: {
                name: randomNumberGeneratorName,
            },
            signature: null,
        };
        randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
        return this.driver.executeScript(
            '$(\'#main-eval-randomNumberGeneratorJson\').val(\'' +
            JSON.stringify(randomNumberGenerator) +
            '\');'
        );
    }

    setRoundingMode(roundingMode) {
        return this.driver.findElement(By.id(`main-eval-roundingMode${roundingMode}`)).click();
    }

    toggleHelp() {
        return this.driver.findElement(By.id('main-eval-toggleHelp')).click();
    }

    typeExpressionText(expressionText) {
        return this.driver.findElement(By.id('main-eval-expressionText')).sendKeys(expressionText);
    }

    waitUntilHelpIsDisplayed() {
        return this.driver
            .wait(until.elementIsVisible(this.driver.findElement(By.id('main-eval-help'))), 5000)
            .then((element) => element.isDisplayed());
    }

    waitUntilHelpIsNotDisplayed() {
        return this.driver
            .wait(until.elementIsNotVisible(this.driver.findElement(By.id('main-eval-help'))), 5000)
            .then((element) => element.isDisplayed());
    }
}

module.exports = HomePage;
