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
var dice = require('../../../lib/dice');

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
    createBagThatProvidesDiceThatAlwaysRollOne: function () {
        function randomNumberGenerator() {
            return 1;
        }
        return dice.bag.create(randomNumberGenerator);
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
    createDieThatRollsEachSideSuccessively: function (sides) {
        var bag,
            rollCount = 0;

        function randomNumberGenerator() {
            var roll = rollCount % sides + 1;
            rollCount += 1;
            return roll;
        }
        bag = dice.bag.create(randomNumberGenerator);
        return bag.d(sides);
    },

    /**
     * Indicates the specified dice expressions are equal.
     *
     * @param {Object} first - The first dice expression to compare.
     * @param {Object} second - The second dice expression to compare.
     *
     * @returns {Boolean!} `true` if the specified dice expressions are equal;
     *      otherwise `false`.
     */
    isDiceExpressionEqual: function (first, second) {
        // istanbul ignore else
        if (_.has(first, 'typeId') &&
                _.has(first, 'evaluate') &&
                _.has(second, 'typeId') &&
                _.has(second, 'evaluate')) {
            // do not consider function members when testing for equality
            return JSON.stringify(first) === JSON.stringify(second);
        }
    },

    /**
     * Indicates the specified dice expression results are equal.
     *
     * @param {Object} first - The first dice expression result to compare.
     * @param {Object} second - The second dice expression result to compare.
     *
     * @returns {Boolean!} `true` if the specified dice expression results are
     *      equal; otherwise `false`.
     */
    isDiceExpressionResultEqual: function (first, second) {
        // istanbul ignore else
        if (_.has(first, 'typeId') &&
                _.has(first, 'value') &&
                _.has(second, 'typeId') &&
                _.has(second, 'value')) {
            // do not consider function members when testing for equality
            return JSON.stringify(first) === JSON.stringify(second);
        }
    }
};
