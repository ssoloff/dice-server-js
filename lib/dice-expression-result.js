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
var diceExpressionTypeIds = require("./dice-expression-type-ids");

function createAdditionExpressionResult(augendExpressionResult, addendExpressionResult) {
    return {
        addendExpressionResult: addendExpressionResult,
        augendExpressionResult: augendExpressionResult,
        typeId: diceExpressionTypeIds.ADDITION,
        value: function () {
            return augendExpressionResult.value() + addendExpressionResult.value();
        }
    };
}

function createConstantExpressionResult(constant) {
    return {
        constant: constant,
        typeId: diceExpressionTypeIds.CONSTANT,
        value: function () {
            return constant;
        }
    };
}

function createMultiplicationExpressionResult(multiplicandExpressionResult, multiplierExpressionResult) {
    return {
        multiplicandExpressionResult: multiplicandExpressionResult,
        multiplierExpressionResult: multiplierExpressionResult,
        typeId: diceExpressionTypeIds.MULTIPLICATION,
        value: function () {
            return multiplicandExpressionResult.value() * multiplierExpressionResult.value();
        }
    };
}

function createRollExpressionResult(count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }

    function sum(first, second) {
        return first + second;
    }
    var rolls = _(count).times(die.roll);
    return {
        die: die,
        rolls: rolls,
        typeId: diceExpressionTypeIds.ROLL,
        value: function () {
            return this.rolls.reduce(sum, 0);
        }
    };
}

function createSubtractionExpressionResult(minuendExpressionResult, subtrahendExpressionResult) {
    return {
        minuendExpressionResult: minuendExpressionResult,
        subtrahendExpressionResult: subtrahendExpressionResult,
        typeId: diceExpressionTypeIds.SUBTRACTION,
        value: function () {
            return minuendExpressionResult.value() - subtrahendExpressionResult.value();
        }
    };
}

module.exports.forAddition = createAdditionExpressionResult;
module.exports.forConstant = createConstantExpressionResult;
module.exports.forMultiplication = createMultiplicationExpressionResult;
module.exports.forRoll = createRollExpressionResult;
module.exports.forSubtraction = createSubtractionExpressionResult;

