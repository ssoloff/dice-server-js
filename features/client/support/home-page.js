/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const security = require('../../common/support/security');
const webdriver = require('selenium-webdriver');

const By = webdriver.By;
const Key = webdriver.Key;
const promise = webdriver.promise;
const until = webdriver.until;

class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  awaitErrorMessageDisplayed(displayed) {
    return this._awaitStaticElementDisplayed(By.id('main-eval-errorMessage'), displayed);
  }

  awaitErrorMessageLengthAbove(minLength) {
    return this._awaitStaticElementTextLengthAbove(By.id('main-eval-errorMessage'), minLength);
  }

  awaitExpressionCanonicalTextAtIndex(index, expressionCanonicalText) {
    return this._awaitDynamicElementText(
      By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(2)`),
      expressionCanonicalText
    );
  }

  awaitExpressionResultCount(expressionResultCount) {
    return this._awaitDynamicElementCount(By.css('#main-history-expressionResults tr'), expressionResultCount);
  }

  awaitExpressionResultTextAtIndex(index, expressionResultText) {
    return this._awaitDynamicElementText(
      By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(3)`),
      expressionResultText
    );
  }

  awaitExpressionResultValueAtIndex(index, expressionResultValue) {
    return this._awaitDynamicElementText(
      By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(4)`),
      expressionResultValue
    );
  }

  awaitExpressionTextAtIndex(index, expressionText) {
    return this._awaitDynamicElementText(
      By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(1)`),
      expressionText
    );
  }

  awaitHelpDisplayed(displayed) {
    return this._awaitStaticElementDisplayed(By.id('main-eval-help'), displayed);
  }

  awaitHelpLinkText(helpLinkText) {
    return this._awaitDynamicElementText(By.id('main-eval-toggleHelp'), helpLinkText);
  }

  clearExpressionText() {
    return this.driver.findElement(By.id('main-eval-expressionText')).clear();
  }

  evaluate() {
    return this.driver.findElement(By.id('main-eval-evaluate')).click();
  }

  open() {
    return this.driver.get('http://localhost:3000/').then(() => {
      // Wait for async load of all feature fragments to complete
      const timeoutInMilliseconds = 60000;
      return promise.all([
        this.driver.wait(until.elementLocated(By.id('main-eval-expressionForm')), timeoutInMilliseconds),
        this.driver.wait(until.elementLocated(By.id('main-history-removeAllResults')), timeoutInMilliseconds),
        this.driver.wait(until.elementLocated(By.id('main-sim-dieRollResults')), timeoutInMilliseconds),
      ]);
    });
  }

  reevaluateResultAtIndex(index) {
    return this._wait(until.elementsLocated(
        By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(5)`)
      ))
      .then((elements) => elements[0].findElement(By.name('reevaluate')).click());
  }

  removeAllResults() {
    return this.driver.findElement(By.id('main-history-removeAllResults')).click();
  }

  removeResultAtIndex(index) {
    return this._wait(until.elementsLocated(
        By.css(`#main-history-expressionResults tr:nth-child(${index}) td:nth-child(5)`)
      ))
      .then((elements) => elements[0].findElement(By.name('remove')).click());
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

  typeEnter() {
    return this.typeExpressionText(Key.ENTER);
  }

  typeExpressionText(expressionText) {
    return this.driver.findElement(By.id('main-eval-expressionText')).sendKeys(expressionText);
  }

  waitUntilResultCountIs(resultCount) {
    const locator = By.css('#main-history-expressionResults tr');
    const untilElementCountIs = new webdriver.Condition(`until element count is '${resultCount}'`, () => {
      return this.driver.findElements(locator)
        .then((elements) => elements.length === resultCount ? elements : null);
    });
    return this._wait(untilElementCountIs);
  }

  _awaitDynamicElementCount(locator, count) {
    const untilElementCountIs = new webdriver.Condition(`until element count is '${count}'`, () => {
      return this.driver.findElements(locator)
        .then((elements) => elements.length === count ? elements : null);
    });
    return this._wait(untilElementCountIs)
      .then((elements) => elements.length)
      .catch(() => this.driver.findElements(locator).then((elements) => elements.length));
  }

  _awaitDynamicElementText(locator, text) {
    const untilElementTextIs = new webdriver.WebElementCondition(`until element text is '${text}'`, () => {
      return this.driver.findElements(locator)
        .then((elements) => {
          if (elements.length === 0) {
            return null;
          }
          const element = elements[0];
          return element.getText().then((t) => t === text ? element : null);
        });
    });
    return this._wait(untilElementTextIs)
      .then((element) => element.getText())
      .catch(() => this.driver.findElement(locator).getText());
  }

  _awaitStaticElementDisplayed(locator, displayed) {
    const untilElementDisplayed = displayed ? until.elementIsVisible : until.elementIsNotVisible;
    return this._wait(untilElementDisplayed(this.driver.findElement(locator)))
      .then((element) => element.isDisplayed())
      .catch(() => this.driver.findElement(locator).isDisplayed());
  }

  _awaitStaticElementTextLengthAbove(locator, minLength) {
    return this._wait(until.elementTextMatches(this.driver.findElement(locator), new RegExp(`^.{${minLength + 1},}$`)))
      .then((element) => element.getText())
      .catch(() => this.driver.findElement(locator).getText());
  }

  _wait(condition) {
    const timeoutInMilliseconds = 5000;
    return this.driver.wait(condition, timeoutInMilliseconds);
  }
}

module.exports = HomePage;
