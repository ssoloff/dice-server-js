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

var diceExpression = {};

diceExpression.add = function (augendExpression, addendExpression) {
    return function () {
        var augend = augendExpression();
        var addend = addendExpression();
        return {
            source: augend.source + "+" + addend.source,
            value: augend.value + addend.value
        };
    };
};

diceExpression.constant = function (value) {
    return function () {
        return {
            source: value.toString(),
            value: value
        };
    };
};

diceExpression.roll = function (count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }
    return _(count).times(_.constant(die)).reduce(this.add);
};

diceExpression.subtract = function (minuendExpression, subtrahendExpression) {
    return function () {
        var minuend = minuendExpression();
        var subtrahend = subtrahendExpression();
        return {
            source: minuend.source + "-" + subtrahend.source,
            value: minuend.value - subtrahend.value
        };
    };
};

module.exports = diceExpression;

