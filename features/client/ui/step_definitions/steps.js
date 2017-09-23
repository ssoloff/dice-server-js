/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

defineSupportCode(({Given, When, Then}) => {
  Given('the home page is open', function () {
    return this.homePage.open()
  })

  Given('the random number generator name is {string}', function (randomNumberGeneratorName) {
    return this.homePage.setRandomNumberGenerator(randomNumberGeneratorName)
  })

  When('the ENTER key is pressed', function () {
    return this.homePage.typeEnter()
  })

  When('the expression {string} is entered', function (expression) {
    return this.homePage.clearExpressionText()
      .then(() => this.homePage.typeExpressionText(expression))
  })

  When(
    /^the expression "([^"]*)" is evaluated( and added to the results table)?$/,
    function (expression, waitForResultRow) {
      let promise = this.homePage.clearExpressionText()
        .then(() => this.homePage.typeExpressionText(expression))
        .then(() => this.homePage.evaluate())
        .then(() => this.homePage.waitUntilResponseReceived())

      if (waitForResultRow) {
        this.resultRowCount += 1
        promise = promise.then(() => this.homePage.waitUntilResultRowCountIs(this.resultRowCount))
      }

      return promise
    }
  )

  When(/^the reevaluate button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function (row) {
    this.resultRowCount += 1
    return this.homePage.reevaluateResultAtRow(row)
      .then(() => this.homePage.waitUntilResponseReceived())
      .then(() => this.homePage.waitUntilResultRowCountIs(this.resultRowCount))
  })

  When('the remove all button is clicked', function () {
    return this.homePage.removeAllResults()
  })

  When(/^the remove button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function (row) {
    return this.homePage.removeResultAtRow(row)
  })

  When('the rounding mode is {string}', function (roundingMode) {
    return this.homePage.setRoundingMode(roundingMode)
  })

  Then('an error message should be displayed', function () {
    return this.homePage.awaitUntil(() =>
      this.homePage.isErrorMessageDisplayed()
        .then((displayed) => expect(displayed).to.be.true)
        .then(() => this.homePage.getErrorMessage())
        .then((text) => expect(text).to.have.length.above(1))
    )
  })

  Then('an error message should not be displayed', function () {
    return this.homePage.awaitUntil(() =>
      this.homePage.isErrorMessageDisplayed()
        .then((displayed) => expect(displayed).to.be.false)
    )
  })

  Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression canonical text should be "([^"]*)"$/,
    function (row, expressionCanonicalText) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionCanonicalTextAtRow(Number(row || '1'))
          .then((text) => expect(text).to.equal(expressionCanonicalText))
      )
    }
  )

  Then(/^the(?: (\d+)(?:st|nd|rd|th))? expression text should be "([^"]*)"$/, function (row, expressionText) {
    return this.homePage.awaitUntil(() =>
      this.homePage.getExpressionTextAtRow(Number(row || '1'))
        .then((text) => expect(text).to.equal(expressionText))
    )
  })

  Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression result text should be "([^"]*)"$/,
    function (row, expressionResultText) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionResultTextAtRow(Number(row || '1'))
          .then((text) => expect(text).to.equal(expressionResultText))
      )
    }
  )

  Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression result value should be "([^"]*)"$/,
    function (row, expressionResultValue) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionResultValueAtRow(Number(row || '1'))
          .then((text) => expect(text).to.equal(expressionResultValue))
      )
    }
  )

  Then('the results table should be empty', function () {
    return this.homePage.awaitUntil(() =>
      this.homePage.getExpressionResultCount()
        .then((expressionResultCount) => expect(expressionResultCount).to.equal(0))
    )
  })
})
