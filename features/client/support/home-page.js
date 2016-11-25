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

const ExpressionResultsColumns = {
  EXPRESSION_TEXT: 1,
  EXPRESSION_CANONICAL_TEXT: 2,
  EXPRESSION_RESULT_TEXT: 3,
  EXPRESSION_RESULT_VALUE: 4,
  ACTIONS: 5,
};

const Locators = {
  allExpressionResultRows: () => By.css('#main-history-expressionResults tr'),

  dieRollResults: () => By.id('main-sim-dieRollResults'),

  errorMessage: () => By.id('main-eval-errorMessage'),

  evaluate: () => By.id('main-eval-evaluate'),

  expressionForm: () => By.id('main-eval-expressionForm'),

  expressionResultCell: (row, column) => {
    return By.css(`#main-history-expressionResults tr:nth-child(${row}) td:nth-child(${column})`);
  },

  expressionText: () => By.id('main-eval-expressionText'),

  help: () => By.id('main-eval-help'),

  reevaluateExpressionResult: () => By.name('reevaluate'),

  removeAllResults: () => By.id('main-history-removeAllResults'),

  removeExpressionResult: () => By.name('remove'),

  roundingMode: (roundingMode) => By.id(`main-eval-roundingMode${roundingMode}`),

  toggleHelp: () => By.id('main-eval-toggleHelp'),
};

class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  awaitErrorMessageDisplayed(displayed) {
    return this._awaitStaticElementDisplayed(Locators.errorMessage(), displayed);
  }

  awaitErrorMessageLengthAbove(minLength) {
    return this._awaitStaticElementTextLengthAbove(Locators.errorMessage(), minLength);
  }

  awaitExpressionCanonicalTextAtIndex(index, expressionCanonicalText) {
    return this._awaitDynamicElementText(
      Locators.expressionResultCell(index, ExpressionResultsColumns.EXPRESSION_CANONICAL_TEXT),
      expressionCanonicalText
    );
  }

  awaitExpressionResultCount(expressionResultCount) {
    return this._awaitDynamicElementCount(Locators.allExpressionResultRows(), expressionResultCount);
  }

  awaitExpressionResultTextAtIndex(index, expressionResultText) {
    return this._awaitDynamicElementText(
      Locators.expressionResultCell(index, ExpressionResultsColumns.EXPRESSION_RESULT_TEXT),
      expressionResultText
    );
  }

  awaitExpressionResultValueAtIndex(index, expressionResultValue) {
    return this._awaitDynamicElementText(
      Locators.expressionResultCell(index, ExpressionResultsColumns.EXPRESSION_RESULT_VALUE),
      expressionResultValue
    );
  }

  awaitExpressionTextAtIndex(index, expressionText) {
    return this._awaitDynamicElementText(
      Locators.expressionResultCell(index, ExpressionResultsColumns.EXPRESSION_TEXT),
      expressionText
    );
  }

  awaitHelpDisplayed(displayed) {
    return this._awaitStaticElementDisplayed(Locators.help(), displayed);
  }

  awaitHelpLinkText(helpLinkText) {
    return this._awaitDynamicElementText(Locators.toggleHelp(), helpLinkText);
  }

  clearExpressionText() {
    return this.driver.findElement(Locators.expressionText()).clear();
  }

  evaluate() {
    return this.driver.findElement(Locators.evaluate()).click();
  }

  open() {
    return this.driver.get('http://localhost:3000/').then(() => {
      // Wait for async load of all feature fragments to complete
      const timeoutInMilliseconds = 60000;
      return promise.all([
        this.driver.wait(until.elementLocated(Locators.expressionForm()), timeoutInMilliseconds),
        this.driver.wait(until.elementLocated(Locators.removeAllResults()), timeoutInMilliseconds),
        this.driver.wait(until.elementLocated(Locators.dieRollResults()), timeoutInMilliseconds),
      ]);
    });
  }

  reevaluateResultAtIndex(index) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(index, ExpressionResultsColumns.ACTIONS)))
      .then((elements) => elements[0].findElement(Locators.reevaluateExpressionResult()).click());
  }

  removeAllResults() {
    return this.driver.findElement(Locators.removeAllResults()).click();
  }

  removeResultAtIndex(index) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(index, ExpressionResultsColumns.ACTIONS)))
      .then((elements) => elements[0].findElement(Locators.removeExpressionResult()).click());
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
    return this.driver.findElement(Locators.roundingMode(roundingMode)).click();
  }

  toggleHelp() {
    return this.driver.findElement(Locators.toggleHelp()).click();
  }

  typeEnter() {
    return this.typeExpressionText(Key.ENTER);
  }

  typeExpressionText(expressionText) {
    return this.driver.findElement(Locators.expressionText()).sendKeys(expressionText);
  }

  waitUntilResultCountIs(resultCount) {
    const locator = Locators.allExpressionResultRows();
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
