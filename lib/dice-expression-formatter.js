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

'use strict';

var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for formatting dice expressions.
 *
 * @module dice-expression-formatter
 */

var formatters = {};
formatters[diceExpressionTypeIds.ADDITION] = formatAdditionExpression;
formatters[diceExpressionTypeIds.ARRAY] = formatArrayExpression;
formatters[diceExpressionTypeIds.CONSTANT] = formatConstantExpression;
formatters[diceExpressionTypeIds.DIE] = formatDieExpression;
formatters[diceExpressionTypeIds.DIVISION] = formatDivisionExpression;
formatters[diceExpressionTypeIds.FUNCTION_CALL] = formatFunctionCallExpression;
formatters[diceExpressionTypeIds.GROUP] = formatGroupExpression;
formatters[diceExpressionTypeIds.MODULO] = formatModuloExpression;
formatters[diceExpressionTypeIds.MULTIPLICATION] = formatMultiplicationExpression;
formatters[diceExpressionTypeIds.NEGATIVE] = formatNegativeExpression;
formatters[diceExpressionTypeIds.POSITIVE] = formatPositiveExpression;
formatters[diceExpressionTypeIds.SUBTRACTION] = formatSubtractionExpression;

/**
 * Formats the specified dice expression.
 *
 * @memberOf module:dice-expression-formatter
 *
 * @param {Object!} expression - The expression to format.
 *
 * @returns {String!} The formatted expression.
 *
 * @throws {Error} If `expression` is not defined or if a formatter is not
 *      available for the specified expression.
 */
function format(expression) {
    var formatter = formatters[expression.typeId];
    if (formatter) {
        return formatter(expression);
    } else {
        throw new Error('unknown expression type: "' + expression.typeId + '"');
    }
}

function formatAdditionExpression(expression) {
    return format(expression.augendExpression) +
        ' + ' +
        format(expression.addendExpression);
}

function formatArrayExpression(expression) {
    return '[' +
        expression.expressions.map(format).join(', ') +
        ']';
}

function formatConstantExpression(expression) {
    return expression.constant.toString();
}

function formatDieExpression(expression) {
    return 'd' + expression.die.sides.toString();
}

function formatDivisionExpression(expression) {
    return format(expression.dividendExpression) +
        ' / ' +
        format(expression.divisorExpression);
}

function formatFunctionCallExpression(expression) {
    return expression.name +
        '(' +
        expression.argumentListExpressions.map(format).join(', ') +
        ')';
}

function formatGroupExpression(expression) {
    return '(' +
        format(expression.childExpression) +
        ')';
}

function formatModuloExpression(expression) {
    return format(expression.dividendExpression) +
        ' % ' +
        format(expression.divisorExpression);
}

function formatMultiplicationExpression(expression) {
    return format(expression.multiplicandExpression) +
        ' * ' +
        format(expression.multiplierExpression);
}

function formatNegativeExpression(expression) {
    return '-' + format(expression.childExpression);
}

function formatPositiveExpression(expression) {
    return '+' + format(expression.childExpression);
}

function formatSubtractionExpression(expression) {
    return format(expression.minuendExpression) +
        ' - ' +
        format(expression.subtrahendExpression);
}

module.exports.format = format;

