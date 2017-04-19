/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const diceBag = require('./dice-bag')
const diceExpression = require('./dice-expression')
const diceExpressionFormatter = require('./dice-expression-formatter')
const diceExpressionParser = require('./dice-expression-parser') // eslint-disable-line node/no-missing-require
const diceExpressionResult = require('./dice-expression-result')
const diceExpressionResultFormatter = require('./dice-expression-result-formatter')

/**
 * Facade for accessing the submodules in the library.
 *
 * @module dice
 */
module.exports = {
  /**
   * The bag submodule.
   *
   * @type {module:dice-bag}
   */
  bag: diceBag,

  /**
   * The expression submodule.
   *
   * @type {module:dice-expression}
   */
  expression: diceExpression,

  /**
   * The expression formatter submodule.
   *
   * @type {module:dice-expression-formatter}
   */
  expressionFormatter: diceExpressionFormatter,

  /**
   * The expression parser submodule.
   *
   * @type {module:dice-expression-parser}
   */
  expressionParser: diceExpressionParser,

  /**
   * The expression result submodule.
   *
   * @type {module:dice-expression-result}
   */
  expressionResult: diceExpressionResult,

  /**
   * The expression result formatter submodule.
   *
   * @type {module:dice-expression-result-formatter}
   */
  expressionResultFormatter: diceExpressionResultFormatter
}
