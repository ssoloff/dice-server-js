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

const ResultsTableColumns = {
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

  awaitUntil(promiseSupplier) {
    const untilPromiseIsResolved = new webdriver.Condition('until promise is resolved', () => {
      return promiseSupplier().catch(() => null);
    });
    return this._wait(untilPromiseIsResolved).catch(() => promiseSupplier());
  }

  clearExpressionText() {
    return this.driver.findElement(Locators.expressionText()).clear();
  }

  evaluate() {
    return this.driver.findElement(Locators.evaluate()).click();
  }

  getErrorMessage() {
    return this.driver.findElement(Locators.errorMessage()).getText();
  }

  getExpressionCanonicalTextAtRow(row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_CANONICAL_TEXT))
      .getText();
  }

  getExpressionResultCount() {
    return this.driver.findElements(Locators.allExpressionResultRows())
      .then((elements) => elements.length);
  }

  getExpressionResultTextAtRow(row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_RESULT_TEXT))
      .getText();
  }

  getExpressionResultValueAtRow(row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_RESULT_VALUE))
      .getText();
  }

  getExpressionTextAtRow(row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_TEXT))
      .getText();
  }

  getHelpLinkText() {
    return this.driver.findElement(Locators.toggleHelp()).getText();
  }

  isErrorMessageDisplayed() {
    return this.driver.findElement(Locators.errorMessage()).isDisplayed();
  }

  isHelpDisplayed() {
    return this.driver.findElement(Locators.help()).isDisplayed();
  }

  open() {
    return this.driver.get('http://localhost:3000/')
      .then(() => {
        // Wait for async load of all feature fragments to complete
        const timeoutInMilliseconds = 60000;
        return promise.all([
          this._wait(until.elementLocated(Locators.expressionForm()), timeoutInMilliseconds),
          this._wait(until.elementLocated(Locators.removeAllResults()), timeoutInMilliseconds),
          this._wait(until.elementLocated(Locators.dieRollResults()), timeoutInMilliseconds),
        ]);
      });
  }

  reevaluateResultAtRow(row) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(row, ResultsTableColumns.ACTIONS)))
      .then((elements) => elements[0].findElement(Locators.reevaluateExpressionResult()).click());
  }

  removeAllResults() {
    return this.driver.findElement(Locators.removeAllResults()).click();
  }

  removeResultAtRow(row) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(row, ResultsTableColumns.ACTIONS)))
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

  waitUntilResultRowCountIs(rowCount) {
    const locator = Locators.allExpressionResultRows();
    const untilResultRowCountIs = new webdriver.Condition(`until result row count is '${rowCount}'`, () =>
      this.driver.findElements(locator)
        .then((elements) => elements.length === rowCount ? elements : null)
    );
    return this._wait(untilResultRowCountIs);
  }

  _wait(condition, timeoutInMilliseconds = 5000) {
    return this.driver.wait(condition, timeoutInMilliseconds);
  }
}

module.exports = HomePage;
