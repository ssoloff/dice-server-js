/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const config = require('../../common/support/config')
const security = require('../../common/support/security')
const webdriver = require('selenium-webdriver')

const By = webdriver.By
const Key = webdriver.Key
const promise = webdriver.promise
const until = webdriver.until

const ResultsTableColumns = {
  EXPRESSION_TEXT: 1,
  EXPRESSION_CANONICAL_TEXT: 2,
  EXPRESSION_RESULT_TEXT: 3,
  EXPRESSION_RESULT_VALUE: 4,
  ACTIONS: 5
}

const Locators = {
  allExpressionResultRows: () => By.css('#main-history-expressionResults tr'),

  correlationId: () => By.id('main-eval-correlationId'),

  errorMessage: () => By.id('main-eval-errorMessage'),

  evaluate: () => By.id('main-eval-evaluate'),

  expressionResultCell: (row, column) => {
    return By.css(`#main-history-expressionResults tr:nth-child(${row}) td:nth-child(${column})`)
  },

  expressionText: () => By.id('main-eval-expressionText'),

  randomNumberGeneratorJson: () => By.id('main-eval-randomNumberGeneratorJson'),

  reevaluateExpressionResult: () => By.name('reevaluate'),

  removeAllResults: () => By.id('main-history-removeAllResults'),

  removeExpressionResult: () => By.name('remove'),

  requestId: () => By.id('main-eval-requestId'),

  roundingMode: (roundingMode) => By.id(`main-eval-roundingMode${roundingMode}`)
}

class HomePage {
  constructor (driver) {
    this.driver = driver
  }

  awaitUntil (promiseSupplier) {
    const untilPromiseIsResolved = new webdriver.Condition('until promise is resolved', () => {
      return promiseSupplier().catch(() => null)
    })
    return this._wait(untilPromiseIsResolved).catch(() => promiseSupplier())
  }

  clearExpressionText () {
    return this.driver.findElement(Locators.expressionText()).clear()
  }

  evaluate () {
    return this.driver.findElement(Locators.evaluate()).click()
  }

  getErrorMessage () {
    return this.driver.findElement(Locators.errorMessage()).getText()
  }

  getExpressionCanonicalTextAtRow (row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_CANONICAL_TEXT))
      .getText()
  }

  getExpressionResultCount () {
    return this.driver.findElements(Locators.allExpressionResultRows())
      .then((elements) => elements.length)
  }

  getExpressionResultTextAtRow (row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_RESULT_TEXT))
      .getText()
  }

  getExpressionResultValueAtRow (row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_RESULT_VALUE))
      .getText()
  }

  getExpressionTextAtRow (row) {
    return this.driver.findElement(Locators.expressionResultCell(row, ResultsTableColumns.EXPRESSION_TEXT))
      .getText()
  }

  isErrorMessageDisplayed () {
    return this.driver.findElement(Locators.errorMessage()).isDisplayed()
  }

  open () {
    return this.driver.get(`${config.baseUri}/`)
  }

  reevaluateResultAtRow (row) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(row, ResultsTableColumns.ACTIONS)))
      .then((elements) => elements[0].findElement(Locators.reevaluateExpressionResult()).click())
  }

  removeAllResults () {
    return this.driver.findElement(Locators.removeAllResults()).click()
  }

  removeResultAtRow (row) {
    return this._wait(until.elementsLocated(Locators.expressionResultCell(row, ResultsTableColumns.ACTIONS)))
      .then((elements) => elements[0].findElement(Locators.removeExpressionResult()).click())
  }

  setRandomNumberGenerator (randomNumberGeneratorName) {
    const randomNumberGenerator = {
      content: {
        name: randomNumberGeneratorName
      },
      signature: null
    }
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content)
    return this._wait(until.elementsLocated(Locators.randomNumberGeneratorJson()))
      .then((element) => this.driver.executeScript(
        'document.getElementById(\'main-eval-randomNumberGeneratorJson\').value = \'' +
          JSON.stringify(randomNumberGenerator) +
          '\';'
      ))
  }

  setRoundingMode (roundingMode) {
    return this.driver.findElement(Locators.roundingMode(roundingMode)).click()
  }

  typeEnter () {
    return this.typeExpressionText(Key.ENTER)
  }

  typeExpressionText (expressionText) {
    return this.driver.findElement(Locators.expressionText()).sendKeys(expressionText)
  }

  waitUntilResponseReceived () {
    const untilResponseReceived = new webdriver.Condition('until response received', () =>
      promise.all([
        this.driver.findElement(Locators.requestId()).getText(),
        this.driver.findElement(Locators.correlationId()).getText()
      ])
        .then(([requestId, correlationId]) => requestId === correlationId ? true : null)
    )
    return this._wait(untilResponseReceived)
  }

  waitUntilResultRowCountIs (rowCount) {
    const locator = Locators.allExpressionResultRows()
    const untilResultRowCountIs = new webdriver.Condition(`until result row count is '${rowCount}'`, () =>
      this.driver.findElements(locator)
        .then((elements) => elements.length === rowCount ? elements : null)
    )
    return this._wait(untilResultRowCountIs)
  }

  _wait (condition, timeoutInMilliseconds = 5000) {
    return this.driver.wait(condition, timeoutInMilliseconds)
  }
}

module.exports = HomePage
