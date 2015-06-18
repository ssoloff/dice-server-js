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

module.exports.createDieThatRollsEachSideSuccessively = function (sides) {
    var rollCount = 0;
    var randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
    randomNumberGenerator.and.callFake(function () {
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
};

