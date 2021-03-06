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
const diceExpressionFunctions = require('./dice-expression-functions')

function createDecimalDiceRollExpression (context, literal) {
  const dieCountForDPercent = 2
  const dieCountForTrailingZeros = literal.slice(2).length
  const dieCount = dieCountForDPercent + dieCountForTrailingZeros
  const components = matchDiceRollLiteral(`${dieCount}d10`)
  const rollExpression = createRollFunctionCallExpression(context, components)
  return createDecimalFunctionCallExpression(context, rollExpression)
}

function createDecimalFunctionCallExpression (context, rollExpression) {
  return createFunctionCallExpression(context, 'decimal', [rollExpression])
}

function createDefaultContext () {
  return {
    bag: diceBag.create(),
    functions: {}
  }
}

function createDiceRollExpression (context, literal) {
  const components = matchDiceRollLiteral(literal)

  let rollExpression = createRollFunctionCallExpression(context, components)

  const isRollModifierPresent = components[3] !== undefined
  if (isRollModifierPresent) {
    rollExpression = createRollModifierFunctionCallExpression(context, rollExpression, components)
  }

  return createSumFunctionCallExpression(context, rollExpression)
}

function createDieExpression (context, literal) {
  const sides = Number(literal.slice(1))
  return diceExpression.forDie(context.bag.d(sides))
}

function createFunctionCallExpression (context, name, argumentListExpressions) {
  const func = context.functions[name] || diceExpressionFunctions[name]
  return diceExpression.forFunctionCall(name, func, argumentListExpressions)
}

function createRollFunctionCallExpression (context, components) {
  const rollCount = Number(components[1])
  const dieLiteral = components[2]
  return createFunctionCallExpression(context, 'roll', [
    diceExpression.forConstant(rollCount),
    createDieExpression(context, dieLiteral)
  ])
}

function createRollModifierFunctionCallExpression (context, rollExpression, components) {
  const rollModifierOperation = components[4]
  const rollModifierCount = components[5] ? Number(components[5]) : 1
  const rollModifierDieType = components[6]
  const rollModifierFunctionName = getRollModifierFunctionName(rollModifierOperation, rollModifierDieType)
  return createFunctionCallExpression(context, rollModifierFunctionName, [
    rollExpression,
    diceExpression.forConstant(rollModifierCount)
  ])
}

function createSumFunctionCallExpression (context, rollExpression) {
  return createFunctionCallExpression(context, 'sum', [rollExpression])
}

function getRollModifierFunctionName (rollModifierOperation, rollModifierDieType) {
  const rollModifierFunctionNames = {
    '+': {
      H: 'cloneHighestRolls',
      L: 'cloneLowestRolls'
    },
    '-': {
      H: 'dropHighestRolls',
      L: 'dropLowestRolls'
    }
  }
  return rollModifierFunctionNames[rollModifierOperation][rollModifierDieType]
}

function matchDiceRollLiteral (literal) {
  return literal.match(/^(\d+)(d\d+)(([-+])(\d*)([HL]))?$/)
}

/**
 * Provides utility methods for the dice notation parser.
 *
 * These methods are only intended for use by the dice notation parser and
 * should not be used by any other client.
 *
 * @module dice-expression-parser-utils
 */
module.exports = {
  /**
   * @function createDecimalDiceRollExpression
   * @summary Creates a new decimal dice roll expression.
   *
   * @param {module:dice-expression-parser~Context!} context - The dice
   *      expression parser context.
   * @param {String!} literal - The decimal dice roll literal, e.g. `d%0`.
   *
   * @returns {module:dice-expression~FunctionCallExpression!} A new
   *      function call expression representing the decimal dice roll, e.g.
   *      `decimal(roll(3, d10))`.
   */
  createDecimalDiceRollExpression,

  /**
   * @function createDefaultContext
   * @summary Creates a new default dice expression parser context.
   * @description The default context uses a default dice bag and includes
   *      no additional function implementations.
   *
   * @returns {module:dice-expression-parser~Context!} A new dice expression
   *      parser context.
   */
  createDefaultContext,

  /**
   * @function createDiceRollExpression
   * @summary Creates a new dice roll expression.
   *
   * @param {module:dice-expression-parser~Context!} context - The dice
   *      expression parser context.
   * @param {String!} literal - The dice roll literal, e.g. `3d6`.
   *
   * @returns {module:dice-expression~FunctionCallExpression!} A new
   *      function call expression representing the dice roll, e.g.
   *      `sum(roll(3, d6))`.
   */
  createDiceRollExpression,

  /**
   * @function createDieExpression
   * @summary Creates a new die expression from the specified die literal.
   *
   * @param {module:dice-expression-parser~Context!} context - The dice
   *      expression parser context.
   * @param {String!} literal - The die literal, e.g. `d6`.
   *
   * @returns {module:dice-expression~DieExpression!} A new die expression.
   */
  createDieExpression,

  /**
   * @function createFunctionCallExpression
   * @summary Creates a new function call expression.
   *
   * @param {module:dice-expression-parser~Context!} context - The dice
   *      expression parser context.
   * @param {String!} name - The function name.
   * @param {module:dice-expression~Expression[]!} argumentListExpressions -
   *      The expressions that represent the arguments to the function call.
   *
   * @returns {module:dice-expression~FunctionCallExpression!} A new
   *      function call expression.
   */
  createFunctionCallExpression
}
