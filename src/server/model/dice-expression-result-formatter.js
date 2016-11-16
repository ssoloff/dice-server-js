/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const _ = require('underscore');
const diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for formatting dice expression results.
 *
 * @module dice-expression-result-formatter
 */

const formatters = {};
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
  const formatter = formatters[expressionResult.typeId];
  if (formatter) {
    return formatter(expressionResult);
  }

  throw new Error(`unknown expression result type: "${expressionResult.typeId}"`);
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
  return `${expressionResult.value}`;
}

function formatDieExpressionResult(expressionResult) {
  return `d${expressionResult.value.sides}`;
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
  return `-${format(expressionResult.childExpressionResult)}`;
}

function formatPositiveExpressionResult(expressionResult) {
  return `+${format(expressionResult.childExpressionResult)}`;
}

function formatSubtractionExpressionResult(expressionResult) {
  return format(expressionResult.minuendExpressionResult) +
    ' - ' +
    format(expressionResult.subtrahendExpressionResult);
}

function formatValue(value) {
  if (_.isArray(value)) {
    return `[${value.join(', ')}]`;
  }

  return `${value}`;
}

module.exports.format = format;
