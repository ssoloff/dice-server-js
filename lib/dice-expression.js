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
var diceExpressionResult = require("./dice-expression-result");
var diceExpressionTypeIds = require("./dice-expression-type-ids");

function createAdditionExpression(augendExpression, addendExpression) {
    return {
        addendExpression: addendExpression,
        augendExpression: augendExpression,
        evaluate: function () {
            return diceExpressionResult.forAddition(
                augendExpression.evaluate(),
                addendExpression.evaluate()
                );
        },
        typeId: diceExpressionTypeIds.ADDITION
    };
}

function createConstantExpression(constant) {
    return {
        constant: constant,
        evaluate: function () {
            return diceExpressionResult.forConstant(constant);
        },
        typeId: diceExpressionTypeIds.CONSTANT
    };
}

function createDivisionExpression(dividendExpression, divisorExpression) {
    return {
        dividendExpression: dividendExpression,
        divisorExpression: divisorExpression,
        evaluate: function () {
            return diceExpressionResult.forDivision(
                dividendExpression.evaluate(),
                divisorExpression.evaluate()
                );
        },
        typeId: diceExpressionTypeIds.DIVISION
    };
}

function createMultiplicationExpression(multiplicandExpression, multiplierExpression) {
    return {
        evaluate: function () {
            return diceExpressionResult.forMultiplication(
                multiplicandExpression.evaluate(),
                multiplierExpression.evaluate()
                );
        },
        multiplicandExpression: multiplicandExpression,
        multiplierExpression: multiplierExpression,
        typeId: diceExpressionTypeIds.MULTIPLICATION
    };
}

function createRollExpression(count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }

    return {
        count: count,
        die: die,
        evaluate: function () {
            var rolls = _(count).times(die.roll);
            return diceExpressionResult.forRoll(rolls);
        },
        typeId: diceExpressionTypeIds.ROLL
    };
}

function createSubtractionExpression(minuendExpression, subtrahendExpression) {
    return {
        evaluate: function () {
            return diceExpressionResult.forSubtraction(
                minuendExpression.evaluate(),
                subtrahendExpression.evaluate()
                );
        },
        minuendExpression: minuendExpression,
        subtrahendExpression: subtrahendExpression,
        typeId: diceExpressionTypeIds.SUBTRACTION
    };
}

module.exports.forAddition = createAdditionExpression;
module.exports.forConstant = createConstantExpression;
module.exports.forDivision = createDivisionExpression;
module.exports.forMultiplication = createMultiplicationExpression;
module.exports.forRoll = createRollExpression;
module.exports.forSubtraction = createSubtractionExpression;

