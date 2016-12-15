/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')

function cloneRolls (rolls, count, findIndexOfRoll) {
  if (!rolls) {
    throw new Error('rolls is not defined')
  } else if (!_.isNumber(count)) {
    throw new Error('count is not a number')
  } else if (count < 0) {
    throw new Error('count is negative')
  }

  const newRolls = rolls.slice(0)
  const oldRolls = rolls.slice(0)
  for (let pass = 0; pass < count; pass += 1) {
    if (oldRolls.length === 0) {
      break
    }
    const index = oldRolls.reduce(findIndexOfRoll, 0)
    newRolls.push(oldRolls[index])
    oldRolls.splice(index, 1)
  }
  return newRolls
}

function dropRolls (rolls, count, findIndexOfRoll) {
  if (!rolls) {
    throw new Error('rolls is not defined')
  } else if (!_.isNumber(count)) {
    throw new Error('count is not a number')
  } else if (count < 0) {
    throw new Error('count is negative')
  }

  const newRolls = rolls.slice(0)
  for (let pass = 0; pass < count; pass += 1) {
    if (newRolls.length === 0) {
      break
    }
    const index = newRolls.reduce(findIndexOfRoll, 0)
    newRolls.splice(index, 1)
  }
  return newRolls
}

function findIndexOfHighestRoll (indexOfHighestRoll, value, index, array) {
  return value > array[indexOfHighestRoll] ? index : indexOfHighestRoll
}

function findIndexOfLowestRoll (indexOfLowestRoll, value, index, array) {
  return value < array[indexOfLowestRoll] ? index : indexOfLowestRoll
}

/**
 * Provides built-in functions for use in a dice expression.
 *
 * @module dice-expression-functions
 */
module.exports = {
  /**
   * Returns the smallest integer greater than or equal to the specified
   *      number.
   *
   * @param {Number} x - A number.
   *
   * @returns {Number!} The smallest integer greater than or equal to the
   *      specified number, or `NaN` if `x` is not defined, or `0` if `x` is
   *      `null`.
   */
  ceil (x) {
    return Math.ceil(x)
  },

  /**
   * Returns a new collection of rolls with one or more of the highest rolls
   * in the specified collection cloned and appended to the original
   * collection of rolls.
   *
   * @param {Number[]!} rolls - The collection of rolls.
   * @param {Number!} count - The number of rolls to clone.
   *
   * @returns {Number[]!} The collection of rolls with the `count` highest
   *      rolls cloned.
   *
   * @throws {Error} If `rolls` is not defined or if `count` is not a
   *      positive number.
   */
  cloneHighestRolls (rolls, count) {
    return cloneRolls(rolls, count, findIndexOfHighestRoll)
  },

  /**
   * Returns a new collection of rolls with one or more of the lowest rolls
   * in the specified collection cloned and appended to the original
   * collection of rolls.
   *
   * @param {Number[]!} rolls - The collection of rolls.
   * @param {Number!} count - The number of rolls to clone.
   *
   * @returns {Number[]!} The collection of rolls with the `count` lowest
   *      rolls cloned.
   *
   * @throws {Error} If `rolls` is not defined or if `count` is not a
   *      positive number.
   */
  cloneLowestRolls (rolls, count) {
    return cloneRolls(rolls, count, findIndexOfLowestRoll)
  },

  /**
   * Returns a new collection of rolls with one or more of the highest rolls
   * in the specified collection dropped.
   *
   * @param {Number[]!} rolls - The collection of rolls.
   * @param {Number!} count - The number of rolls to drop.
   *
   * @returns {Number[]!} The collection of rolls with the `count` highest
   *      rolls dropped.
   *
   * @throws {Error} If `rolls` is not defined or if `count` is not a
   *      positive number.
   */
  dropHighestRolls (rolls, count) {
    return dropRolls(rolls, count, findIndexOfHighestRoll)
  },

  /**
   * Returns a new collection of rolls with one or more of the lowest rolls
   * in the specified collection dropped.
   *
   * @param {Number[]!} rolls - The collection of rolls.
   * @param {Number!} count - The number of rolls to drop.
   *
   * @returns {Number[]!} The collection of rolls with the `count` lowest
   *      rolls dropped.
   *
   * @throws {Error} If `rolls` is not defined or if `count` is not a
   *      positive number.
   */
  dropLowestRolls (rolls, count) {
    return dropRolls(rolls, count, findIndexOfLowestRoll)
  },

  /**
   * Returns the largest integer less than or equal to the specified number.
   *
   * @param {Number} x - A number.
   *
   * @returns {Number!} The largest integer less than or equal to the
   *      specified number, or `NaN` if `x` is not defined, or `0` if `x` is
   *      `null`.
   */
  floor (x) {
    return Math.floor(x)
  },

  /**
   * Rolls one or more instances of the specified die.
   *
   * @param {Number!} count - The number of dice to roll.
   * @param {module:dice-bag~Die!} die - The die to roll.
   *
   * @returns {Number[]!} The collection of rolls.
   *
   * @throws {Error} If `count` is not a positive number or if `die` is not
   *      defined.
   */
  roll (count, die) {
    if (!_.isNumber(count)) {
      throw new Error('count is not a number')
    } else if (count < 1) {
      throw new RangeError('count is not positive')
    } else if (!die) {
      throw new Error('die is not defined')
    }

    return _(count).times(die.roll)
  },

  /**
   * @summary Returns the value of the specified number rounded to the
   *      nearest integer.
   *
   * @description If the fractional portion of number is 0.5 or greater, the
   *      argument is rounded to the next higher integer.  If the fractional
   *      portion of number is less than 0.5, the argument is rounded to the
   *      next lower integer.
   *
   * @param {Number} x - A number.
   *
   * @returns {Number!} The value of the specified number rounded to the
   *      nearest integer, or `NaN` if `x` is not defined, or `0` if `x` is
   *      `null`.
   */
  round (x) {
    return Math.round(x)
  },

  /**
   * Returns the sum of the specified collection of rolls.
   *
   * @param {Number[]!} rolls - The collection of rolls to sum.
   *
   * @returns {Number!} The sum of the specified collection of rolls.
   *
   * @throws {Error} If `rolls` is not defined or if `rolls` contains less
   *      than one element.
   */
  sum (rolls) {
    if (!rolls || rolls.length < 1) {
      throw new Error('roll count is not positive')
    }

    return rolls.reduce((first, second) => first + second, 0)
  },

  /**
   * @summary Returns the integral part of the specified number by removing
   *      any fractional digits.
   *
   * @description If the argument is a positive number, `trunc` is equivalent
   *      to `floor`, otherwise `trunc` is equivalent to `ceil`.
   *
   * @param {Number} x - A number.
   *
   * @returns {Number!} The integral part of the specified number, or `NaN`
   *      if `x` is not defined, or `0` if `x` is `null`.
   */
  trunc (x) {
    return Math.trunc(x)
  }
}
