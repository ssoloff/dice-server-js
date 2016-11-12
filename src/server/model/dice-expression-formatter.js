/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for formatting dice expressions.
 *
 * @module dice-expression-formatter
 */

const formatters = {};
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
 * @param {module:dice-expression~Expression!} expression - The expression to
 *      format.
 *
 * @returns {String!} The formatted expression.
 *
 * @throws {Error} If `expression` is not defined or if a formatter is not
 *      available for the specified expression.
 */
function format(expression) {
    const formatter = formatters[expression.typeId];
    if (formatter) {
        return formatter(expression);
    }

    throw new Error(`unknown expression type: "${expression.typeId}"`);
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
    return `${expression.constant}`;
}

function formatDieExpression(expression) {
    return `d${expression.die.sides}`;
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
    return `-${format(expression.childExpression)}`;
}

function formatPositiveExpression(expression) {
    return `+${format(expression.childExpression)}`;
}

function formatSubtractionExpression(expression) {
    return format(expression.minuendExpression) +
        ' - ' +
        format(expression.subtrahendExpression);
}

module.exports.format = format;
