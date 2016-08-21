/*
 * Copyright (c) 2016 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var _ = require('underscore');

function cloneRolls(rolls, count, findIndexOfRoll) {
    if (!rolls) {
        throw new Error('rolls is not defined');
    } else if (!_.isNumber(count)) {
        throw new Error('count is not a number');
    } else if (count < 0) {
        throw new Error('count is negative');
    }

    var newRolls = rolls.slice(0);
    var oldRolls = rolls.slice(0);
    for (var pass = 0; pass < count; pass += 1) {
        if (oldRolls.length === 0) {
            break;
        }
        var index = oldRolls.reduce(findIndexOfRoll, 0);
        newRolls.push(oldRolls[index]);
        oldRolls.splice(index, 1);
    }
    return newRolls;
}

function dropRolls(rolls, count, findIndexOfRoll) {
    if (!rolls) {
        throw new Error('rolls is not defined');
    } else if (!_.isNumber(count)) {
        throw new Error('count is not a number');
    } else if (count < 0) {
        throw new Error('count is negative');
    }

    var newRolls = rolls.slice(0);
    for (var pass = 0; pass < count; pass += 1) {
        if (newRolls.length === 0) {
            break;
        }
        var index = newRolls.reduce(findIndexOfRoll, 0);
        newRolls.splice(index, 1);
    }
    return newRolls;
}

function findIndexOfHighestRoll(indexOfHighestRoll, value, index, array) {
    return value > array[indexOfHighestRoll] ? index : indexOfHighestRoll;
}

function findIndexOfLowestRoll(indexOfLowestRoll, value, index, array) {
    return value < array[indexOfLowestRoll] ? index : indexOfLowestRoll;
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
    ceil: function (x) {
        return Math.ceil(x);
    },

    /**
     * Returns a new collection of rolls with one or more of the highest rolls
     * in the specified collection cloned and appended to the original
     * collection of rolls.
     *
     * @param {Array.<Number>!} rolls - The collection of rolls.
     * @param {Number!} count - The number of rolls to clone.
     *
     * @returns {Array.<Number>!} The collection of rolls with the `count`
     *      highest rolls cloned.
     *
     * @throws {Error} If `rolls` is not defined or if `count` is not a
     *      positive number.
     */
    cloneHighestRolls: function (rolls, count) {
        return cloneRolls(rolls, count, findIndexOfHighestRoll);
    },

    /**
     * Returns a new collection of rolls with one or more of the lowest rolls
     * in the specified collection cloned and appended to the original
     * collection of rolls.
     *
     * @param {Array.<Number>!} rolls - The collection of rolls.
     * @param {Number!} count - The number of rolls to clone.
     *
     * @returns {Array.<Number>!} The collection of rolls with the `count`
     *      lowest rolls cloned.
     *
     * @throws {Error} If `rolls` is not defined or if `count` is not a
     *      positive number.
     */
    cloneLowestRolls: function (rolls, count) {
        return cloneRolls(rolls, count, findIndexOfLowestRoll);
    },

    /**
     * Returns a new collection of rolls with one or more of the highest rolls
     * in the specified collection dropped.
     *
     * @param {Array.<Number>!} rolls - The collection of rolls.
     * @param {Number!} count - The number of rolls to drop.
     *
     * @returns {Array.<Number>!} The collection of rolls with the `count`
     *      highest rolls dropped.
     *
     * @throws {Error} If `rolls` is not defined or if `count` is not a
     *      positive number.
     */
    dropHighestRolls: function (rolls, count) {
        return dropRolls(rolls, count, findIndexOfHighestRoll);
    },

    /**
     * Returns a new collection of rolls with one or more of the lowest rolls
     * in the specified collection dropped.
     *
     * @param {Array.<Number>!} rolls - The collection of rolls.
     * @param {Number!} count - The number of rolls to drop.
     *
     * @returns {Array.<Number>!} The collection of rolls with the `count`
     *      lowest rolls dropped.
     *
     * @throws {Error} If `rolls` is not defined or if `count` is not a
     *      positive number.
     */
    dropLowestRolls: function (rolls, count) {
        return dropRolls(rolls, count, findIndexOfLowestRoll);
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
    floor: function (x) {
        return Math.floor(x);
    },

    /**
     * Rolls one or more instances of the specified die.
     *
     * @param {Number!} count - The number of dice to roll.
     * @param {module:dice-bag~Die!} die - The die to roll.
     *
     * @returns {Array.<Number>!} The collection of rolls.
     *
     * @throws {Error} If `count` is not a positive number or if `die` is not
     *      defined.
     */
    roll: function (count, die) {
        if (!_.isNumber(count)) {
            throw new Error('count is not a number');
        } else if (count < 1) {
            throw new RangeError('count is not positive');
        } else if (!die) {
            throw new Error('die is not defined');
        }

        return _(count).times(die.roll);
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
    round: function (x) {
        return Math.round(x);
    },

    /**
     * Returns the sum of the specified collection of rolls.
     *
     * @param {Array.<Number>!} rolls - The collection of rolls to sum.
     *
     * @returns {Number!} The sum of the specified collection of rolls.
     *
     * @throws {Error} If `rolls` is not defined or if `rolls` contains less
     *      than one element.
     */
    sum: function (rolls) {
        if (!rolls || rolls.length < 1) {
            throw new Error('roll count is not positive');
        }

        return rolls.reduce(
            function (first, second) {
                return first + second;
            },
            0
        );
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
    trunc: function (x) {
        return Math.trunc(x);
    }
};
