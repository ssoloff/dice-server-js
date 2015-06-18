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

"use strict";

var _ = require("underscore");
var dice = require("../lib/dice");

/**
 * @namespace
 * @description Provides useful properties and methods for testing the dice
 *      server.
 */
var diceTest = {
    /**
     * Represents the difference between one and the smallest value greater
     * than one that can be represented as a `Number`.
     *
     * @constant {Number}
     */
    EPSILON: 2.2204460492503130808472633361816E-16,

    /**
     * Represents the minimum safe integer in JavaScript (-(2<sup>53</sup> - 1)).
     *
     * @constant {Number}
     */
    MIN_SAFE_INTEGER: -9007199254740991,

    /**
     * Creates a new die with the specified count of sides where rolling the
     * die will deterministically and repeatedly result in the sequence
     * [1,`sides`].
     *
     * @param {Number} sides - The count of sides for the new die.
     *
     * @returns {die} The new die.
     *
     * @throws {RangeError} If `sides` is not positive.
     */
    createDieThatRollsEachSideSuccessively: function (sides) {
        var rollCount = 0;
        var randomNumberGenerator = jasmine.createSpy("randomNumberGenerator").and.callFake(function () {
            function getRandomNumberForIndex(index) {
                return index / sides;
            }
            var randomNumbers = _(sides).times(getRandomNumberForIndex);
            var roll = randomNumbers[rollCount];
            rollCount = (rollCount + 1) % randomNumbers.length;
            return roll;
        });
        var bag = new dice.Bag(randomNumberGenerator);
        return bag.d(sides);
    }
};

module.exports = diceTest;

