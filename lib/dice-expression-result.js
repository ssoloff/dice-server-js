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

var _ = require('underscore');
var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides methods for creating dice expression results.
 *
 * @module dice-expression-result
 */
module.exports = {
    /**
     * Creates a new addition expression result.
     *
     * @param {Number!} sum - The sum of the augend and the addend.
     * @param {Object!} augendExpressionResult - The augend expression result.
     * @param {Object!} addendExpressionResult - The addend expression result.
     *
     * @returns {module:dice-expression-result~AdditionExpressionResult!} The
     *      new addition expression result.
     *
     * @throws {Error} If `sum` is not a number, or if `augendExpressionResult`
     *      is not defined, or if `addendExpressionResult` is not defined.
     */
    forAddition: function (sum, augendExpressionResult, addendExpressionResult) {
        if (!_.isNumber(sum)) {
            throw new Error('sum is not a number');
        } else if (!augendExpressionResult) {
            throw new Error('augend expression result is not defined');
        } else if (!addendExpressionResult) {
            throw new Error('addend expression result is not defined');
        }

        /**
         * The result of an expression that adds two expressions.
         *
         * @namespace AdditionExpressionResult
         */
        return {
            /**
             * The addend expression result.
             *
             * @memberOf module:dice-expression-result~AdditionExpressionResult
             *
             * @type {Object!}
             */
            addendExpressionResult: addendExpressionResult,

            /**
             * The augend expression result.
             *
             * @memberOf module:dice-expression-result~AdditionExpressionResult
             *
             * @type {Object!}
             */
            augendExpressionResult: augendExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~AdditionExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.ADDITION,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~AdditionExpressionResult
             *
             * @type {Number!}
             */
            value: sum
        };
    },

    /**
     * Creates a new array expression result.
     *
     * @param {Array.<Object>!} array - The array of expression result values.
     * @param {Array.<Object>!} expressionResults - The array of expression
     *      results.
     *
     * @returns {module:dice-expression-result~ArrayExpressionResult!} The new
     *      array expression result.
     *
     * @throws {Error} If `array` is not an array or `expressionResults` is not
     *      an array.
     */
    forArray: function (array, expressionResults) {
        if (!_.isArray(array)) {
            throw new Error('array is not an array');
        } else if (!_.isArray(expressionResults)) {
            throw new Error('expression results is not an array');
        }

        /**
         * An expression result that acts as an array of expression results.
         *
         * @namespace ArrayExpressionResult
         */
        return {
            /**
             * The array of expression results.
             *
             * @memberOf module:dice-expression-result~ArrayExpressionResult
             *
             * @type {Array.<Object>!}
             */
            expressionResults: expressionResults,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~ArrayExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.ARRAY,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~ArrayExpressionResult
             *
             * @type {Array.<Object>!}
             */
            value: array
        };
    },

    /**
     * Creates a new constant expression result.
     *
     * @param {Number!} constant - The constant.
     *
     * @returns {module:dice-expression-result~ConstantExpressionResult!} The
     *      new constant expression result.
     *
     * @throws {Error} If `constant` is not a number.
     */
    forConstant: function (constant) {
        if (!_.isNumber(constant)) {
            throw new Error('constant is not a number');
        }

        /**
         * An expression result that represents a constant value.
         *
         * @namespace ConstantExpressionResult
         */
        return {
            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~ConstantExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.CONSTANT,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~ConstantExpressionResult
             *
             * @type {Number!}
             */
            value: constant
        };
    },

    /**
     * Creates a new die expression result.
     *
     * @param {module:dice-bag~Die!} die - The die.
     *
     * @returns {module:dice-expression-result~DieExpressionResult!} The new
     *      die expression result.
     *
     * @throws {Error} If `die` is not defined.
     */
    forDie: function (die) {
        if (!die) {
            throw new Error('die is not defined');
        }

        /**
         * An expression result that represents a die.
         *
         * @namespace DieExpressionResult
         */
        return {
            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~DieExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.DIE,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~DieExpressionResult
             *
             * @type {module:dice-bag~Die!}
             */
            value: die
        };
    },

    /**
     * Creates a new division expression result.
     *
     * @param {Number!} quotient - The quotient of the dividend and the
     *      divisor.
     * @param {Object!} dividendExpressionResult - The dividend expression
     *      result.
     * @param {Object!} divisorExpressionResult - The divisor expression
     *      result.
     *
     * @returns {module:dice-expression-result~DivisionExpressionResult!} The
     *      new division expression result.
     *
     * @throws {Error} If `quotient` is not a number, or if
     *      `dividendExpressionResult` is not defined, or if
     *      `divisorExpressionResult` is not defined.
     */
    forDivision: function (quotient, dividendExpressionResult, divisorExpressionResult) {
        if (!_.isNumber(quotient)) {
            throw new Error('quotient is not a number');
        } else if (!dividendExpressionResult) {
            throw new Error('dividend expression result is not defined');
        } else if (!divisorExpressionResult) {
            throw new Error('divisor expression result is not defined');
        }

        /**
         * The result of an expression that divides two expressions.
         *
         * @namespace DivisionExpressionResult
         */
        return {
            /**
             * The dividend expression result.
             *
             * @memberOf module:dice-expression-result~DivisionExpressionResult
             *
             * @type {Object!}
             */
            dividendExpressionResult: dividendExpressionResult,

            /**
             * The divisor expression result.
             *
             * @memberOf module:dice-expression-result~DivisionExpressionResult
             *
             * @type {Object!}
             */
            divisorExpressionResult: divisorExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~DivisionExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.DIVISION,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~DivisionExpressionResult
             *
             * @type {Number!}
             */
            value: quotient
        };
    },

    /**
     * Creates a new function call expression result.
     *
     * @param {Object!} returnValue - The function return value.
     * @param {String!} name - The function name.
     * @param {Array.<Object>!} argumentListExpressionResults - The expression
     *      results that represent the arguments to the function call.
     *
     * @returns {module:dice-expression-result~FunctionCallExpressionResult!}
     *      The new function call expression result.
     *
     * @throws {Error} If `returnValue` is not defined, or if `name` is not
     *      defined, or if `argumentListExpressionResults` is not defined.
     */
    forFunctionCall: function (returnValue, name, argumentListExpressionResults) {
        if (returnValue === undefined || returnValue === null) {
            throw new Error('return value is not defined');
        } else if (!name) {
            throw new Error('name is not defined');
        } else if (!argumentListExpressionResults) {
            throw new Error('argument list expression results is not defined');
        }

        /**
         * The result of an expression that calls a function.
         *
         * @namespace FunctionCallExpressionResult
         */
        return {
            /**
             * The expression results that represent the arguments to the
             * function call.
             *
             * @memberOf module:dice-expression-result~FunctionCallExpressionResult
             *
             * @type {Array.<Object>!}
             */
            argumentListExpressionResults: argumentListExpressionResults,

            /**
             * The function name.
             *
             * @memberOf module:dice-expression-result~FunctionCallExpressionResult
             *
             * @type {String!}
             */
            name: name,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~FunctionCallExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.FUNCTION_CALL,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~FunctionCallExpressionResult
             *
             * @type {Object!}
             */
            value: returnValue
        };
    },

    /**
     * Creates a new group expression result.
     *
     * @param {Object!} childExpressionResult - The expression result that is
     *      grouped.
     *
     * @returns {module:dice-expression-result~GroupExpressionResult!} The new
     *      group expression result.
     *
     * @throws {Error} If `childExpressionResult` is not defined.
     */
    forGroup: function (childExpressionResult) {
        if (!childExpressionResult) {
            throw new Error('child expression result is not defined');
        }

        /**
         * The result of an expression that groups another expression.
         *
         * @namespace GroupExpressionResult
         */
        return {
            /**
             * The expression result that is grouped.
             *
             * @memberOf module:dice-expression-result~GroupExpressionResult
             *
             * @type {Object!}
             */
            childExpressionResult: childExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~GroupExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.GROUP,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~GroupExpressionResult
             *
             * @type {Object!}
             */
            value: childExpressionResult.value
        };
    },

    /**
     * Creates a new modulo expression result.
     *
     * @param {Number!} remainder - The remainder of the division of the
     *      dividend and the divisor.
     * @param {Object!} dividendExpressionResult - The dividend expression
     *      result.
     * @param {Object!} divisorExpressionResult - The divisor expression
     *      result.
     *
     * @returns {module:dice-expression-result~ModuloExpressionResult!} The new
     *      modulo expression resykt.
     *
     * @throws {Error} If `remainder` is not a number, or if
     *      `dividendExpressionResult` is not defined, or if
     *      `divisorExpressionResult` is not defined.
     */
    forModulo: function (remainder, dividendExpressionResult, divisorExpressionResult) {
        if (!_.isNumber(remainder)) {
            throw new Error('remainder is not a number');
        } else if (!dividendExpressionResult) {
            throw new Error('dividend expression result is not defined');
        } else if (!divisorExpressionResult) {
            throw new Error('divisor expression result is not defined');
        }

        /**
         * The result of an expression that modulos two expressions.
         *
         * @namespace ModuloExpressionResult
         */
        return {
            /**
             * The dividend expression result.
             *
             * @memberOf module:dice-expression-result~ModuloExpressionResult
             *
             * @type {Object!}
             */
            dividendExpressionResult: dividendExpressionResult,

            /**
             * The divisor expression result.
             *
             * @memberOf module:dice-expression-result~ModuloExpressionResult
             *
             * @type {Object!}
             */
            divisorExpressionResult: divisorExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~ModuloExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.MODULO,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~ModuloExpressionResult
             *
             * @type {Number!}
             */
            value: remainder
        };
    },

    /**
     * Creates a new multiplication expression result.
     *
     * @param {Number!} product - The product of the multiplicand and the
     *      multiplier.
     * @param {Object!} multiplicandExpressionResult - The multiplicand
     *      expression result.
     * @param {Object!} multiplierExpressionResult - The multiplier expression
     *      result.
     *
     * @returns {module:dice-expression-result~MultiplicationExpressionResult!}
     *      The new multiplication expression result.
     *
     * @throws {Error} If `product` is not a number, or if
     *      `multiplicandExpressionResult` is not defined, or if
     *      `multiplierExpressionResult` is not defined.
     */
    forMultiplication: function (product, multiplicandExpressionResult, multiplierExpressionResult) {
        if (!_.isNumber(product)) {
            throw new Error('product is not a number');
        } else if (!multiplicandExpressionResult) {
            throw new Error('multiplicand expression result is not defined');
        } else if (!multiplierExpressionResult) {
            throw new Error('multiplier expression result is not defined');
        }

        /**
         * The result of an expression that multiplies two expressions.
         *
         * @namespace MultiplicationExpressionResult
         */
        return {
            /**
             * The multiplicand expression result.
             *
             * @memberOf module:dice-expression-result~MultiplicationExpressionResult
             *
             * @type {Object!}
             */
            multiplicandExpressionResult: multiplicandExpressionResult,

            /**
             * The multiplier expression result.
             *
             * @memberOf module:dice-expression-result~MultiplicationExpressionResult
             *
             * @type {Object!}
             */
            multiplierExpressionResult: multiplierExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~MultiplicationExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.MULTIPLICATION,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~MultiplicationExpressionResult
             *
             * @type {Number!}
             */
            value: product
        };
    },

    /**
     * Creates a new negative expression result.
     *
     * @param {Object!} childExpressionResult - The result of the expression to
     *      be negated.
     *
     * @returns {module:dice-expression-result~NegativeExpressionResult!} The
     *      new negative expression result.
     *
     * @throws {Error} If `childExpressionResult` is not defined.
     */
    forNegative: function (childExpressionResult) {
        if (!childExpressionResult) {
            throw new Error('child expression result is not defined');
        }

        /**
         * The result of an expression that negates another expression.
         *
         * @namespace NegativeExpressionResult
         */
        return {
            /**
             * The result of the expression to be negated.
             *
             * @memberOf module:dice-expression-result~NegativeExpressionResult
             *
             * @type {Object!}
             */
            childExpressionResult: childExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~NegativeExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.NEGATIVE,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~NegativeExpressionResult
             *
             * @type {Object!}
             */
            value: -childExpressionResult.value
        };
    },

    /**
     * Creates a new positive expression result.
     *
     * @param {Object!} childExpressionResult - The result of the expression to
     *      be applied.
     *
     * @returns {module:dice-expression-result~PositiveExpressionResult!} The
     *      new positive expression result.
     *
     * @throws {Error} If `childExpressionResult` is not defined.
     */
    forPositive: function (childExpressionResult) {
        if (!childExpressionResult) {
            throw new Error('child expression result is not defined');
        }

        /**
         * The result of an expression that applies another expression.
         *
         * @namespace PositiveExpressionResult
         */
        return {
            /**
             * The result of the expression to be applied.
             *
             * @memberOf module:dice-expression-result~PositiveExpressionResult
             *
             * @type {Object!}
             */
            childExpressionResult: childExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~PositiveExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.POSITIVE,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~PositiveExpressionResult
             *
             * @type {Object!}
             */
            value: childExpressionResult.value
        };
    },

    /**
     * Creates a new subtraction expression result.
     *
     * @param {Number!} difference - The difference between the minuend and the
     *      subtrahend.
     * @param {Object!} minuendExpressionResult - The minuend expression
     *      result.
     * @param {Object!} subtrahendExpressionResult - The subtrahend expression
     *      result.
     *
     * @returns {module:dice-expression-result~SubtractionExpressionResult!}
     *      The new subtraction expression result.
     *
     * @throws {Error} If `difference` is not a number, or if
     *      `minuendExpressionResult` is not defined or if
     *      `subtrahendExpressionResult` is not defined.
     */
    forSubtraction: function (difference, minuendExpressionResult, subtrahendExpressionResult) {
        if (!_.isNumber(difference)) {
            throw new Error('difference is not a number');
        } else if (!minuendExpressionResult) {
            throw new Error('minuend expression result is not defined');
        } else if (!subtrahendExpressionResult) {
            throw new Error('subtrahend expression result is not defined');
        }

        /**
         * The result of an expression that subtracts two expressions.
         *
         * @namespace SubtractionExpressionResult
         */
        return {
            /**
             * The minuend expression result.
             *
             * @memberOf module:dice-expression-result~SubtractionExpressionResult
             *
             * @type {Object!}
             */
            minuendExpressionResult: minuendExpressionResult,

            /**
             * The subtrahend expression result.
             *
             * @memberOf module:dice-expression-result~SubtractionExpressionResult
             *
             * @type {Object!}
             */
            subtrahendExpressionResult: subtrahendExpressionResult,

            /**
             * The expression result type identifier.
             *
             * @memberOf module:dice-expression-result~SubtractionExpressionResult
             *
             * @type {String!}
             */
            typeId: diceExpressionTypeIds.SUBTRACTION,

            /**
             * The value of the evaluated expression.
             *
             * @memberOf module:dice-expression-result~SubtractionExpressionResult
             *
             * @type {Number!}
             */
            value: difference
        };
    }
};

