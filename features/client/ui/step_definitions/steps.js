/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const chai = require('chai');

const expect = chai.expect;

module.exports = function() {
  function toDomIndex(index) {
    return Number(index ? index : '1');
  }

  this.Before(function(scenario, callback) {
    this.homePage = this.createHomePage();
    callback();
  });

  this.Given(/^the home page is open$/, function() {
    return this.homePage.open();
  });

  this.Given(/^the random number generator name is "(.*)"$/, function(randomNumberGeneratorName) {
    return this.homePage.setRandomNumberGenerator(randomNumberGeneratorName);
  });

  this.When(/^the ENTER key is pressed$/, function() {
    return this.homePage.typeEnter();
  });

  this.When(/^the expression "(.*)" is entered$/, function(expression) {
    return this.homePage.typeExpressionText(expression);
  });

  this.When(/^the expression "(.*)" is evaluated$/, function(expression) {
    return this.homePage.clearExpressionText()
      .then(() => this.homePage.typeExpressionText(expression))
      .then(() => this.homePage.evaluate());
  });

  this.When(/^the(?: hide)? help link is clicked$/, function() {
    return this.homePage.toggleHelp();
  });

  this.When(/^the reevaluate button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function(index) {
    return this.homePage.reevaluateResultAtIndex(index);
  });

  this.When(/^the remove all button is clicked$/, function() {
    return this.homePage.removeAllResults();
  });

  this.When(/^the remove button on the (\d+)(?:st|nd|rd|th) row is clicked$/, function(index) {
    return this.homePage.removeResultAtIndex(index);
  });

  this.When(/^the results table contains (\d+) rows$/, function(rowCount) {
    return this.homePage.waitUntilResultCountIs(Number(rowCount));
  });

  this.When(/^the rounding mode is "(.*)"$/, function(roundingMode) {
    return this.homePage.setRoundingMode(roundingMode);
  });

  this.Then(/^an error message should be displayed$/, function() {
    return this.homePage.awaitUntil(() =>
      this.homePage.isErrorMessageDisplayed()
        .then((displayed) => expect(displayed).to.be.true)
        .then(() => this.homePage.getErrorMessage())
        .then((text) => expect(text).to.have.length.above(1))
    );
  });

  this.Then(/^an error message should not be displayed$/, function() {
    return this.homePage.awaitUntil(() =>
      this.homePage.isErrorMessageDisplayed()
        .then((displayed) => expect(displayed).to.be.false)
    );
  });

  this.Then(/^help should( not)? be displayed$/, function(shouldNotBeDisplayed) {
    const shouldBeDisplayed = !shouldNotBeDisplayed;
    return this.homePage.awaitUntil(() =>
      this.homePage.isHelpDisplayed()
        .then((displayed) => expect(displayed).to.be[shouldBeDisplayed ? 'true' : 'false'])
    );
  });

  this.Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression canonical text should be "(.*)"$/,
    function(index, expressionCanonicalText) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionCanonicalTextAtIndex(toDomIndex(index))
          .then((text) => expect(text).to.equal(expressionCanonicalText))
      );
    }
  );

  this.Then(/^the(?: (\d+)(?:st|nd|rd|th))? expression text should be "(.*)"$/, function(index, expressionText) {
    return this.homePage.awaitUntil(() =>
      this.homePage.getExpressionTextAtIndex(toDomIndex(index))
        .then((text) => expect(text).to.equal(expressionText))
    );
  });

  this.Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression result text should be "(.*)"$/,
    function(index, expressionResultText) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionResultTextAtIndex(toDomIndex(index))
          .then((text) => expect(text).to.equal(expressionResultText))
      );
    }
  );

  this.Then(
    /^the(?: (\d+)(?:st|nd|rd|th))? expression result value should be "(.*)"$/,
    function(index, expressionResultValue) {
      return this.homePage.awaitUntil(() =>
        this.homePage.getExpressionResultValueAtIndex(toDomIndex(index))
          .then((text) => expect(text).to.equal(expressionResultValue))
      );
    }
  );

  this.Then(/^the help link text should be "(.*)"$/, function(helpLinkText) {
    return this.homePage.awaitUntil(() =>
      this.homePage.getHelpLinkText()
        .then((text) => expect(text).to.equal(helpLinkText))
    );
  });

  this.Then(/^the results table should be empty$/, function() {
    return this.homePage.awaitUntil(() =>
      this.homePage.getExpressionResultCount()
        .then((expressionResultCount) => expect(expressionResultCount).to.equal(0))
    );
  });
};
