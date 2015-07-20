/*
 * Copyright (c) 2015 Steven Soloff
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

/**
 * Provides methods for creating a dice bag.
 *
 * @module dice-bag
 */
module.exports = {
    /**
     * Returns a random number in the half-open range [0,1).
     *
     * @callback randomNumberGenerator
     *
     * @returns {Number!} A random number in the half-open range [0,1).
     */

    /**
     * Creates a new dice bag.
     *
     * @param {module:dice-bag~randomNumberGenerator=} randomNumberGenerator -
     *      The random number generator used by all dice created by the dice
     *      bag.  If not defined, `Math.random` will be used.
     *
     * @returns {module:dice-bag~Bag!} The new dice bag.
     */
    create: function (randomNumberGenerator) {
        randomNumberGenerator = randomNumberGenerator || Math.random;

        /**
         * A dice bag.
         *
         * @namespace Bag
         */
        return {
            /**
             * Creates a new die with the specified count of sides.
             *
             * @memberOf module:dice-bag~Bag
             *
             * @param {Number!} sides - The count of sides for the new die.
             *
             * @returns {module:dice-bag~Die!} The new die.
             *
             * @throws {RangeError} If `sides` is not positive.
             */
            d: function (sides) {
                if (!_.isNumber(sides)) {
                    throw new Error('sides is not a number');
                } else if (sides < 1) {
                    throw new RangeError('sides is not positive');
                }

                /**
                 * A die.
                 *
                 * @namespace Die
                 */
                return {
                    /**
                     * Rolls the die.
                     *
                     * @memberOf module:dice-bag~Die
                     *
                     * @returns {Number!} The result of rolling the die: a value
                     *      in the range [1,{@link module:dice-bag~Die.sides}].
                     */
                    roll: function () {
                        return Math.floor(randomNumberGenerator() * sides) + 1;
                    },

                    /**
                     * The count of sides the die possesses.
                     *
                     * @memberOf module:dice-bag~Die
                     *
                     * @type {Number!}
                     */
                    sides: sides
                };
            },

            /**
             * The random number generator used by all dice created by the dice
             * bag.
             *
             * @memberOf module:dice-bag~Bag
             *
             * @type {module:dice-bag~randomNumberGenerator!}
             */
            randomNumberGenerator: randomNumberGenerator
        };
    }
};

