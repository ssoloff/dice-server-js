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

function format(expression) {
    switch (expression.typeId) {
        case diceExpressionTypeIds.ADDITION:
            return formatAdditionExpression(expression);

        case diceExpressionTypeIds.CONSTANT:
            return formatConstantExpression(expression);

        case diceExpressionTypeIds.MULTIPLICATION:
            return formatMultiplicationExpression(expression);

        case diceExpressionTypeIds.ROLL:
            return formatRollExpression(expression);

        case diceExpressionTypeIds.SUBTRACTION:
            return formatSubtractionExpression(expression);

        default:
            throw new Error("unknown expression type: '" + expression.typeId + "'");
    }
}

function formatAdditionExpression(expression) {
    return format(expression.augendExpression)
        + " + "
        + format(expression.addendExpression);
}

function formatConstantExpression(expression) {
    return expression.constant.toString();
}

function formatMultiplicationExpression(expression) {
    return format(expression.multiplicandExpression)
        + " * "
        + format(expression.multiplierExpression);
}

function formatRollExpression(expression) {
    return ((expression.count > 1) ? expression.count.toString() : "")
        + "d"
        + expression.die.sides.toString();
}

function formatSubtractionExpression(expression) {
    return format(expression.minuendExpression)
        + " - "
        + format(expression.subtrahendExpression);
}

module.exports.format = format;

