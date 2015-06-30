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

require("./math-polyfills");

var _ = require("underscore");

function roll(count, die) {
    if (typeof count !== "number") {
        throw new Error("count is not a number");
    } else if (count < 1) {
        throw new RangeError("count is not positive");
    } else if (!die) {
        throw new Error("die is not defined");
    }

    return _(count).times(die.roll);
}

function sum(rolls) {
    if (!rolls || (rolls.length < 1)) {
        throw new Error("roll count is not positive");
    }

    return rolls.reduce(
        function (first, second) {
            return first + second;
        },
        0
    );
}

module.exports = {
    ceil: Math.ceil,
    floor: Math.floor,
    roll: roll,
    round: Math.round,
    sum: sum,
    trunc: Math.trunc
};

