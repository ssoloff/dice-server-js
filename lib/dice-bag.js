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

/**
 * @class
 * @classdesc A factory for creating dice of various sides.
 *
 * @description Creates a new dice bag.
 *
 * @param {Function=} randomNumberGenerator - Generates a random number in the
 *      half-open range [0,1).  If not defined, `Math.random` will be used.
 */
function DiceBag(randomNumberGenerator) {
    this.randomNumberGenerator = randomNumberGenerator || Math.random;
}

/**
 * Creates a new die with the specified count of sides.
 *
 * @param {Number} sides - The count of sides for the new die.
 *
 * @returns {die} The new die.
 *
 * @throws {RangeError} If `sides` is not positive.
 */
DiceBag.prototype.d = function (sides) {
    if (sides < 1) {
        throw new RangeError("sides must be positive");
    }

    var roll = function () {
        return Math.floor(this.randomNumberGenerator() * sides) + 1;
    }.bind(this);
    return {
        roll: roll,
        sides: sides
    };
};

module.exports = DiceBag;

