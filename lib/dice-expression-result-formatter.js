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

var formatters = {};
formatters[diceExpressionTypeIds.ADDITION] = formatAdditionExpressionResult;
formatters[diceExpressionTypeIds.CONSTANT] = formatConstantExpressionResult;
formatters[diceExpressionTypeIds.DIE] = formatDieExpressionResult;
formatters[diceExpressionTypeIds.DIVISION] = formatDivisionExpressionResult;
formatters[diceExpressionTypeIds.FUNCTION_CALL] = formatFunctionCallExpressionResult;
formatters[diceExpressionTypeIds.MULTIPLICATION] = formatMultiplicationExpressionResult;
formatters[diceExpressionTypeIds.ROLL] = formatRollExpressionResult;
formatters[diceExpressionTypeIds.SUBTRACTION] = formatSubtractionExpressionResult;

function format(expressionResult) {
    var formatter = formatters[expressionResult.typeId];
    if (formatter) {
        return formatter(expressionResult);
    } else {
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

function formatDieExpressionResult(expressionResult) {
    return "d" + expressionResult.die.sides.toString();
}

function formatDivisionExpressionResult(expressionResult) {
    return format(expressionResult.dividendExpressionResult)
        + " / "
        + format(expressionResult.divisorExpressionResult);
}

function formatFunctionCallExpressionResult(expressionResult) {
    return "["
        + expressionResult.name
        + "("
        + expressionResult.argumentListExpressionResults.map(format).join(", ")
        + "): "
        + expressionResult.value().toString()
        + "]";
}

function formatMultiplicationExpressionResult(expressionResult) {
    return format(expressionResult.multiplicandExpressionResult)
        + " * "
        + format(expressionResult.multiplierExpressionResult);
}

function formatRollExpressionResult(expressionResult) {
    return "["
        + "(" + expressionResult.rolls.join(", ") + ")"
        + ": "
        + expressionResult.rolls.join(" + ")
        + "]";
}

function formatSubtractionExpressionResult(expressionResult) {
    return format(expressionResult.minuendExpressionResult)
        + " - "
        + format(expressionResult.subtrahendExpressionResult);
}

module.exports.format = format;

