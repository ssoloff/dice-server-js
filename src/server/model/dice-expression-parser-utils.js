/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var diceBag = require('./dice-bag'),
    diceExpression = require('./dice-expression'),
    diceExpressionFunctions = require('./dice-expression-functions');

function createDefaultContext() {
    return {
        bag: diceBag.create(),
        functions: {}
    };
}

function createDiceRollExpression(context, literal) {
    var components,
        isRollModifierPresent,
        rollExpression;

    components = literal.match(/^(\d+)(d[\d%]+)(([-+])(\d*)([HL]))?$/);

    rollExpression = createRollFunctionCallExpression(context, components);

    isRollModifierPresent = components[3] !== undefined;
    if (isRollModifierPresent) {
        rollExpression = createRollModifierFunctionCallExpression(context, rollExpression, components);
    }

    return createSumFunctionCallExpression(context, rollExpression);
}

function createDieExpression(context, literal) {
    var formattedSides,
        sides;

    formattedSides = literal.slice(1);
    sides = formattedSides === '%' ? 100 : Number(formattedSides);
    return diceExpression.forDie(context.bag.d(sides));
}

function createFunctionCallExpression(context, name, argumentListExpressions) {
    var func;

    func = context.functions[name] || diceExpressionFunctions[name];
    return diceExpression.forFunctionCall(name, func, argumentListExpressions);
}

function createRollFunctionCallExpression(context, components) {
    var dieLiteral,
        rollCount;

    rollCount = Number(components[1]);
    dieLiteral = components[2];
    return createFunctionCallExpression(context, 'roll', [
        diceExpression.forConstant(rollCount),
        createDieExpression(context, dieLiteral)
    ]);
}

function createRollModifierFunctionCallExpression(context, rollExpression, components) {
    var rollModifierOperation,
        rollModifierCount,
        rollModifierDieType,
        rollModifierFunctionName;

    rollModifierOperation = components[4];
    rollModifierCount = components[5] ? Number(components[5]) : 1;
    rollModifierDieType = components[6];
    rollModifierFunctionName = getRollModifierFunctionName(rollModifierOperation, rollModifierDieType);
    return createFunctionCallExpression(context, rollModifierFunctionName, [
        rollExpression,
        diceExpression.forConstant(rollModifierCount)
    ]);
}

function createSumFunctionCallExpression(context, rollExpression) {
    return createFunctionCallExpression(context, 'sum', [rollExpression]);
}

function getRollModifierFunctionName(rollModifierOperation, rollModifierDieType) {
    var rollModifierFunctionNames = {
        '+': {
            H: 'cloneHighestRolls',
            L: 'cloneLowestRolls'
        },
        '-': {
            H: 'dropHighestRolls',
            L: 'dropLowestRolls'
        }
    };

    return rollModifierFunctionNames[rollModifierOperation][rollModifierDieType];
}

/**
 * Provides utility methods for the dice notation parser.
 *
 * These methods are only intended for use by the dice notation parser and
 * should not be used by any other client.
 *
 * @module dice-expression-parser-utils
 */
module.exports = {
    /**
     * @function createDefaultContext
     * @summary Creates a new default dice expression parser context.
     * @description The default context uses a default dice bag and includes
     *      no additional function implementations.
     *
     * @returns {module:dice-expression-parser~Context!} A new dice expression
     *      parser context.
     */
    createDefaultContext: createDefaultContext,

    /**
     * @function createDiceRollExpression
     * @summary Creates a new dice roll expression.
     *
     * @param {module:dice-expression-parser~Context!} context - The dice
     *      expression parser context.
     * @param {String!} literal - The dice roll literal, e.g. `3d6`.
     *
     * @returns {module:dice-expression~FunctionCallExpression!} A new
     *      function call expression representing the dice roll, e.g.
     *      `sum(roll(3, d6))`.
     */
    createDiceRollExpression: createDiceRollExpression,

    /**
     * @function createDieExpression
     * @summary Creates a new die expression from the specified die literal.
     *
     * @param {module:dice-expression-parser~Context!} context - The dice
     *      expression parser context.
     * @param {String!} literal - The die literal, e.g. `d6`.
     *
     * @returns {module:dice-expression~DieExpression!} A new die expression.
     */
    createDieExpression: createDieExpression,

    /**
     * @function createFunctionCallExpression
     * @summary Creates a new function call expression.
     *
     * @param {module:dice-expression-parser~Context!} context - The dice
     *      expression parser context.
     * @param {String!} name - The function name.
     * @param {module:dice-expression~Expression[]!} argumentListExpressions -
     *      The expressions that represent the arguments to the function call.
     *
     * @returns {module:dice-expression~FunctionCallExpression!} A new
     *      function call expression.
     */
    createFunctionCallExpression: createFunctionCallExpression
};
