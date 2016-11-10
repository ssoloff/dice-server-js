/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const _ = require('underscore');
const diceExpressionResult = require('./dice-expression-result');
const diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for creating dice expressions.
 *
 * @module dice-expression
 */
module.exports = {
    /**
     * Creates a new addition expression.
     *
     * @param {module:dice-expression~Expression!} augendExpression - The
     *      augend expression.
     * @param {module:dice-expression~Expression!} addendExpression - The
     *      addend expression.
     *
     * @returns {module:dice-expression~AdditionExpression!} The new addition
     *      expression.
     *
     * @throws {Error} If `augendExpression` is not defined or if
     *      `addendExpression` is not defined.
     */
    forAddition(augendExpression, addendExpression) {
        if (!augendExpression) {
            throw new Error('augend expression is not defined');
        } else if (!addendExpression) {
            throw new Error('addend expression is not defined');
        }

        /**
         * An expression that adds two expressions.
         *
         * @namespace AdditionExpression
         */
        return {
            /**
             * The addend expression.
             *
             * @memberOf module:dice-expression~AdditionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            addendExpression: addendExpression,

            /**
             * The augend expression.
             *
             * @memberOf module:dice-expression~AdditionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            augendExpression: augendExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~AdditionExpression
             *
             * @returns {module:dice-expression-result~AdditionExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forAddition(
                    augendExpression.evaluate(),
                    addendExpression.evaluate()
                );
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~AdditionExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.ADDITION
        };
    },

    /**
     * Creates a new array expression.
     *
     * @param {module:dice-expression~Expression[]!} expressions - The
     *      expressions that are the array elements.
     *
     * @returns {module:dice-expression~ArrayExpression!} The new array
     *      expression.
     *
     * @throws {Error} If `expressions` is not an array.
     */
    forArray(expressions) {
        if (!_.isArray(expressions)) {
            throw new Error('expressions is not an array');
        }

        /**
         * An expression that acts as an array of expressions.
         *
         * @namespace ArrayExpression
         */
        return {
            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~ArrayExpression
             *
             * @returns {module:dice-expression-result~ArrayExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forArray(_.invoke(expressions, 'evaluate'));
            },

            /**
             * The expressions that are the array elements.
             *
             * @memberOf module:dice-expression~ArrayExpression
             *
             * @type {module:dice-expression~Expression[]!}
             */
            expressions: expressions,

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~ArrayExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.ARRAY
        };
    },

    /**
     * Creates a new constant expression.
     *
     * @param {Number!} constant - The constant.
     *
     * @returns {module:dice-expression~ConstantExpression!} The new constant
     *      expression.
     *
     * @throws {Error} If `constant` is not a number.
     */
    forConstant(constant) {
        if (!_.isNumber(constant)) {
            throw new Error('constant is not a number');
        }

        /**
         * An expression that represents a constant value.
         *
         * @namespace ConstantExpression
         */
        return {
            /**
             * The constant associated with the expression.
             *
             * @memberOf module:dice-expression~ConstantExpression
             *
             * @type {Number!}
             */
            constant: constant,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~ConstantExpression
             *
             * @returns {module:dice-expression-result~ConstantExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forConstant(constant);
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~ConstantExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.CONSTANT
        };
    },

    /**
     * Creates a new die expression.
     *
     * @param {module:dice-bag~Die!} die - The die.
     *
     * @returns {module:dice-expression~DieExpression!} The new die expression.
     *
     * @throws {Error} If `die` is not defined.
     */
    forDie(die) {
        if (!die) {
            throw new Error('die is not defined');
        }

        /**
         * An expression that represents a die.
         *
         * @namespace DieExpression
         */
        return {
            /**
             * The die associated with the expression.
             *
             * @memberOf module:dice-expression~DieExpression
             *
             * @type {module:dice-bag~Die!}
             */
            die: die,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~DieExpression
             *
             * @returns {module:dice-expression-result~DieExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forDie(die);
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~DieExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.DIE
        };
    },

    /**
     * Creates a new division expression.
     *
     * @param {module:dice-expression~Expression!} dividendExpression - The
     *      dividend expression.
     * @param {module:dice-expression~Expression!} divisorExpression - The
     *      divisor expression.
     *
     * @returns {module:dice-expression~DivisionExpression!} The new division
     *      expression.
     *
     * @throws {Error} If `dividendExpression` is not defined or if
     *      `divisorExpression` is not defined.
     */
    forDivision(dividendExpression, divisorExpression) {
        if (!dividendExpression) {
            throw new Error('dividend expression is not defined');
        } else if (!divisorExpression) {
            throw new Error('divisor expression is not defined');
        }

        /**
         * An expression that divides two expressions.
         *
         * @namespace DivisionExpression
         */
        return {
            /**
             * The dividend expression.
             *
             * @memberOf module:dice-expression~DivisionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            dividendExpression: dividendExpression,

            /**
             * The divisor expression.
             *
             * @memberOf module:dice-expression~DivisionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            divisorExpression: divisorExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~DivisionExpression
             *
             * @returns {module:dice-expression-result~DivisionExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forDivision(
                    dividendExpression.evaluate(),
                    divisorExpression.evaluate()
                );
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~DivisionExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.DIVISION
        };
    },

    /**
     * Creates a new function call expression.
     *
     * @param {String!} name - The function name.
     * @param {Function!} func - The function.
     * @param {module:dice-expression~Expression[]!} argumentListExpressions -
     *      The expressions that represent the arguments to the function call.
     *
     * @returns {module:dice-expression~FunctionCallExpression!} The new
     *      function call expression.
     *
     * @throws {Error} If `name` is not a string, or if `func` is not a
     *      function, or if `argumentListExpressions` is not an array.
     */
    forFunctionCall(name, func, argumentListExpressions) {
        if (!_.isString(name)) {
            throw new Error('function name is not a string');
        } else if (!_.isFunction(func)) {
            throw new Error('function is not a function');
        } else if (!_.isArray(argumentListExpressions)) {
            throw new Error('function argument list expressions is not an array');
        }

        /**
         * An expression that calls a function.
         *
         * @namespace FunctionCallExpression
         */
        return {
            /**
             * The expressions that represent the arguments to the function
             * call.
             *
             * @memberOf module:dice-expression~FunctionCallExpression
             *
             * @type {module:dice-expression~Expression[]!}
             */
            argumentListExpressions: argumentListExpressions,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~FunctionCallExpression
             *
             * @returns {module:dice-expression-result~FunctionCallExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                const argumentListExpressionResults = _.invoke(argumentListExpressions, 'evaluate');
                const argumentList = _.pluck(argumentListExpressionResults, 'value');
                const returnValue = func.apply(null, argumentList);
                return diceExpressionResult.forFunctionCall(returnValue, name, argumentListExpressionResults);
            },

            /**
             * The function name.
             *
             * @memberOf module:dice-expression~FunctionCallExpression
             *
             * @type {String!}
             */
            name: name,

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~FunctionCallExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.FUNCTION_CALL
        };
    },

    /**
     * Creates a new group expression.
     *
     * @param {module:dice-expression~Expression!} childExpression - The
     *      expression that is grouped.
     *
     * @returns {module:dice-expression~GroupExpression!} The new group
     *      expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forGroup(childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * An expression that groups another expression.
         *
         * @namespace GroupExpression
         */
        return {
            /**
             * The expression that is grouped.
             *
             * @memberOf module:dice-expression~GroupExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            childExpression: childExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~GroupExpression
             *
             * @returns {module:dice-expression-result~GroupExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forGroup(childExpression.evaluate());
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~GroupExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.GROUP
        };
    },

    /**
     * Creates a new modulo expression.
     *
     * @param {module:dice-expression~Expression!} dividendExpression - The
     *      dividend expression.
     * @param {module:dice-expression~Expression!} divisorExpression - The
     *      divisor expression.
     *
     * @returns {module:dice-expression~ModuloExpression!} The new modulo
     *      expression.
     *
     * @throws {Error} If `dividendExpression` is not defined or if
     *      `divisorExpression` is not defined.
     */
    forModulo(dividendExpression, divisorExpression) {
        if (!dividendExpression) {
            throw new Error('dividend expression is not defined');
        } else if (!divisorExpression) {
            throw new Error('divisor expression is not defined');
        }

        /**
         * An expression that modulos two expressions.
         *
         * @namespace ModuloExpression
         */
        return {
            /**
             * The dividend expression.
             *
             * @memberOf module:dice-expression~ModuloExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            dividendExpression: dividendExpression,

            /**
             * The divisor expression.
             *
             * @memberOf module:dice-expression~ModuloExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            divisorExpression: divisorExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~ModuloExpression
             *
             * @returns {module:dice-expression-result~ModuloExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forModulo(
                    dividendExpression.evaluate(),
                    divisorExpression.evaluate()
                );
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~ModuloExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.MODULO
        };
    },

    /**
     * Creates a new multiplication expression.
     *
     * @param {module:dice-expression~Expression!} multiplicandExpression - The
     *      multiplicand expression.
     * @param {module:dice-expression~Expression!} multiplierExpression - The
     *      multiplier expression.
     *
     * @returns {module:dice-expression~MultiplicationExpression!} The new
     *      multiplication expression.
     *
     * @throws {Error} If `multiplicandExpression` is not defined or if
     *      `multiplierExpression` is not defined.
     */
    forMultiplication(multiplicandExpression, multiplierExpression) {
        if (!multiplicandExpression) {
            throw new Error('multiplicand expression is not defined');
        } else if (!multiplierExpression) {
            throw new Error('multiplier expression is not defined');
        }

        /**
         * An expression that multiplies two expressions.
         *
         * @namespace MultiplicationExpression
         */
        return {
            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~MultiplicationExpression
             *
             * @returns {module:dice-expression-result~MultiplicationExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forMultiplication(
                    multiplicandExpression.evaluate(),
                    multiplierExpression.evaluate()
                );
            },

            /**
             * The multiplicand expression.
             *
             * @memberOf module:dice-expression~MultiplicationExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            multiplicandExpression: multiplicandExpression,

            /**
             * The multiplier expression.
             *
             * @memberOf module:dice-expression~MultiplicationExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            multiplierExpression: multiplierExpression,

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~MultiplicationExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.MULTIPLICATION
        };
    },

    /**
     * Creates a new negative expression.
     *
     * @param {module:dice-expression~Expression!} childExpression - The
     *      expression to be negated.
     *
     * @returns {module:dice-expression~NegativeExpression!} The new negative
     *      expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forNegative(childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * An expression that negates another expression.
         *
         * @namespace NegativeExpression
         */
        return {
            /**
             * The expression to be negated.
             *
             * @memberOf module:dice-expression~NegativeExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            childExpression: childExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~NegativeExpression
             *
             * @returns {module:dice-expression-result~NegativeExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forNegative(childExpression.evaluate());
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~NegativeExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.NEGATIVE
        };
    },

    /**
     * Creates a new positive expression.
     *
     * @param {module:dice-expression~Expression!} childExpression - The
     *      expression to be applied.
     *
     * @returns {module:dice-expression~PositiveExpression!} The new positive
     *      expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forPositive(childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * An expression that applies another expression.
         *
         * @namespace PositiveExpression
         */
        return {
            /**
             * The expression to be applied.
             *
             * @memberOf module:dice-expression~PositiveExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            childExpression: childExpression,

            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~PositiveExpression
             *
             * @returns {module:dice-expression-result~PositiveExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forPositive(childExpression.evaluate());
            },

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~PositiveExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.POSITIVE
        };
    },

    /**
     * Creates a new subtraction expression.
     *
     * @param {module:dice-expression~Expression!} minuendExpression - The
     *      minuend expression.
     * @param {module:dice-expression~Expression!} subtrahendExpression - The
     *      subtrahend expression.
     *
     * @returns {module:dice-expression~SubtractionExpression!} The new
     *      subtraction expression.
     *
     * @throws {Error} If `minuendExpression` is not defined or if
     *      `subtrahendExpression` is not defined.
     */
    forSubtraction(minuendExpression, subtrahendExpression) {
        if (!minuendExpression) {
            throw new Error('minuend expression is not defined');
        } else if (!subtrahendExpression) {
            throw new Error('subtrahend expression is not defined');
        }

        /**
         * An expression that subtracts two expressions.
         *
         * @namespace SubtractionExpression
         */
        return {
            /**
             * Evaluates the expression.
             *
             * @memberOf module:dice-expression~SubtractionExpression
             *
             * @returns {module:dice-expression-result~SubtractionExpressionResult!}
             *      The result of evaluating the expression.
             */
            evaluate() {
                return diceExpressionResult.forSubtraction(
                    minuendExpression.evaluate(),
                    subtrahendExpression.evaluate()
                );
            },

            /**
             * The minuend expression.
             *
             * @memberOf module:dice-expression~SubtractionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            minuendExpression: minuendExpression,

            /**
             * The subtrahend expression.
             *
             * @memberOf module:dice-expression~SubtractionExpression
             *
             * @type {module:dice-expression~Expression!}
             */
            subtrahendExpression: subtrahendExpression,

            /**
             * The expression type identifier.
             *
             * @memberOf module:dice-expression~SubtractionExpression
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.SUBTRACTION
        };
    }
};
