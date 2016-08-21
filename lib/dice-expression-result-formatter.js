/*
 * Copyright (c) 2016 Steven Soloff
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

var _ = require('underscore');
var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for formatting dice expression results.
 *
 * @module dice-expression-result-formatter
 */

var formatters = {};
formatters[diceExpressionTypeIds.ADDITION] = formatAdditionExpressionResult;
formatters[diceExpressionTypeIds.ARRAY] = formatArrayExpressionResult;
formatters[diceExpressionTypeIds.CONSTANT] = formatConstantExpressionResult;
formatters[diceExpressionTypeIds.DIE] = formatDieExpressionResult;
formatters[diceExpressionTypeIds.DIVISION] = formatDivisionExpressionResult;
formatters[diceExpressionTypeIds.FUNCTION_CALL] = formatFunctionCallExpressionResult;
formatters[diceExpressionTypeIds.GROUP] = formatGroupExpressionResult;
formatters[diceExpressionTypeIds.MODULO] = formatModuloExpressionResult;
formatters[diceExpressionTypeIds.MULTIPLICATION] = formatMultiplicationExpressionResult;
formatters[diceExpressionTypeIds.NEGATIVE] = formatNegativeExpressionResult;
formatters[diceExpressionTypeIds.POSITIVE] = formatPositiveExpressionResult;
formatters[diceExpressionTypeIds.SUBTRACTION] = formatSubtractionExpressionResult;

/**
 * Formats the specified dice expression result.
 *
 * @memberOf module:dice-expression-result-formatter
 *
 * @param {module:dice-expression-result~ExpressionResult!} expressionResult -
 *      The expression result to format.
 *
 * @returns {String!} The formatted expression result.
 *
 * @throws {Error} If `expressionResult` is not defined or if a formatter is
 *      not available for the specified expression result.
 */
function format(expressionResult) {
    var formatter = formatters[expressionResult.typeId];
    if (formatter) {
        return formatter(expressionResult);
    } else {
        throw new Error('unknown expression result type: "' + expressionResult.typeId + '"');
    }
}

function formatAdditionExpressionResult(expressionResult) {
    return format(expressionResult.augendExpressionResult) +
        ' + ' +
        format(expressionResult.addendExpressionResult);
}

function formatArrayExpressionResult(expressionResult) {
    return '[' +
        expressionResult.expressionResults.map(format).join(', ') +
        ']';
}

function formatConstantExpressionResult(expressionResult) {
    return expressionResult.value.toString();
}

function formatDieExpressionResult(expressionResult) {
    return 'd' + expressionResult.value.sides.toString();
}

function formatDivisionExpressionResult(expressionResult) {
    return format(expressionResult.dividendExpressionResult) +
        ' / ' +
        format(expressionResult.divisorExpressionResult);
}

function formatFunctionCallExpressionResult(expressionResult) {
    return '[' +
        expressionResult.name +
        '(' +
        expressionResult.argumentListExpressionResults.map(format).join(', ') +
        ') -> ' +
        formatValue(expressionResult.value) +
        ']';
}

function formatGroupExpressionResult(expressionResult) {
    return '(' +
        format(expressionResult.childExpressionResult) +
        ')';
}

function formatModuloExpressionResult(expressionResult) {
    return format(expressionResult.dividendExpressionResult) +
        ' % ' +
        format(expressionResult.divisorExpressionResult);
}

function formatMultiplicationExpressionResult(expressionResult) {
    return format(expressionResult.multiplicandExpressionResult) +
        ' * ' +
        format(expressionResult.multiplierExpressionResult);
}

function formatNegativeExpressionResult(expressionResult) {
    return '-' + format(expressionResult.childExpressionResult);
}

function formatPositiveExpressionResult(expressionResult) {
    return '+' + format(expressionResult.childExpressionResult);
}

function formatSubtractionExpressionResult(expressionResult) {
    return format(expressionResult.minuendExpressionResult) +
        ' - ' +
        format(expressionResult.subtrahendExpressionResult);
}

function formatValue(value) {
    if (_.isArray(value)) {
        return '[' + value.join(', ') + ']';
    }

    return value.toString();
}

module.exports.format = format;
