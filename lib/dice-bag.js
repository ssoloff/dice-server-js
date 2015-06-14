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
 */
function DiceBag(randomNumberGenerator) {
    this.randomNumberGenerator = randomNumberGenerator || Math.random;
}

/**
 * @summary Creates a new die with the specified count of sides.
 *
 * @description A die is "rolled" either by invoking the `roll()` method or by
 *      invoking the die as a function (e.g. `d6()`).  It also supports the
 *      `sides` property to query the count of sides of the die.
 *
 * @param {Number} sides - The count of sides for the new die.
 * @returns {Object} The new die.
 */
DiceBag.prototype.d = function (sides) {
    var roll = function () {
        return Math.floor(this.randomNumberGenerator() * sides) + 1;
    }.bind(this);
    var die = function () {
        return roll();
    };
    die.sides = sides;
    die.roll = roll;
    return die;
};

module.exports = DiceBag;

