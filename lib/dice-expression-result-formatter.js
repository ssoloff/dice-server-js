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

var diceExpressionTypeIds = require("./dice-expression-type-ids");

function format(expressionResult) {
    switch (expressionResult.typeId) {
        case diceExpressionTypeIds.ADDITION:
            return formatAdditionExpressionResult(expressionResult);

        case diceExpressionTypeIds.CONSTANT:
            return formatConstantExpressionResult(expressionResult);

        case diceExpressionTypeIds.ROLL:
            return formatRollExpressionResult(expressionResult);

        case diceExpressionTypeIds.SUBTRACTION:
            return formatSubtractionExpressionResult(expressionResult);

        default:
            throw new Error("unknown expression result type: '" + expressionResult.typeId + "'");
    }
}

function formatAdditionExpressionResult(expressionResult) {
    return format(expressionResult.augendExpressionResult)
        + " + "
        + format(expressionResult.addendExpressionResult);
}

function formatConstantExpressionResult(expressionResult) {
    return expressionResult.constant.toString();
}

function formatRollExpressionResult(expressionResult) {
    return expressionResult.roll.toString() + " [d" + expressionResult.die.sides.toString() + "]";
}

function formatSubtractionExpressionResult(expressionResult) {
    return format(expressionResult.minuendExpressionResult)
        + " - "
        + format(expressionResult.subtrahendExpressionResult);
}

module.exports.format = format;
