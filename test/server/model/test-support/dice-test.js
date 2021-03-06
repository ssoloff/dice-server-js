/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const dice = require('../../../../src/server/model/dice')

/**
 * Provides useful methods for testing the dice server.
 *
 * @module dice-test
 */
module.exports = {
  /**
   * Creates a new dice bag that produces dice that will deterministically
   * and repeatedly roll 1.
   *
   * @returns {module:dice-bag~Bag!} The new dice bag.
   */
  createBagThatProvidesDiceThatAlwaysRollOne () {
    function randomNumberGenerator () {
      return 1
    }
    return dice.bag.create(randomNumberGenerator)
  },

  /**
   * Creates a new die with the specified count of sides where rolling the
   * die will deterministically and repeatedly result in the sequence
   * [1,`sides`].
   *
   * @param {Number!} sides - The count of sides for the new die.
   *
   * @returns {module:dice-bag~Die!} The new die.
   *
   * @throws {RangeError} If `sides` is not positive.
   */
  createDieThatRollsEachSideSuccessively (sides) {
    let rollCount = 0
    function randomNumberGenerator () {
      const roll = rollCount % sides + 1
      rollCount += 1
      return roll
    }
    const bag = dice.bag.create(randomNumberGenerator)
    return bag.d(sides)
  },

  /**
   * Indicates the specified dice expressions are equal.
   *
   * @param {Object} first - The first dice expression to compare.
   * @param {Object} second - The second dice expression to compare.
   *
   * @returns {Boolean!} `true` if the specified dice expressions are equal
   *      otherwise `false`.
   */
  isDiceExpressionEqual (first, second) {
    if (_.has(first, 'typeId') &&
        _.has(first, 'evaluate') &&
        _.has(second, 'typeId') &&
        _.has(second, 'evaluate')) {
      // Do not consider function members when testing for equality
      return JSON.stringify(first) === JSON.stringify(second)
    }
  },

  /**
   * Indicates the specified dice expression results are equal.
   *
   * @param {Object} first - The first dice expression result to compare.
   * @param {Object} second - The second dice expression result to compare.
   *
   * @returns {Boolean!} `true` if the specified dice expression results are
   *      equal otherwise `false`.
   */
  isDiceExpressionResultEqual (first, second) {
    if (_.has(first, 'typeId') &&
        _.has(first, 'value') &&
        _.has(second, 'typeId') &&
        _.has(second, 'value')) {
      // Do not consider function members when testing for equality
      return JSON.stringify(first) === JSON.stringify(second)
    }
  }
}
