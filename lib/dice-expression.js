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
var diceExpressionResult = require('./dice-expression-result');
var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * @namespace dice.expression
 * @description Provides methods for creating dice expressions.
 */
var expression = {
    /**
     * @function dice.expression.forAddition
     * @summary Creates a new addition expression.
     *
     * @param {Object} augendExpression - The augend expression.
     * @param {Object} addendExpression - The addend expression.
     *
     * @returns {dice.expression.additionExpression} The new addition
     *      expression.
     *
     * @throws {Error} If `augendExpression` is not defined or if
     *      `addendExpression` is not defined.
     */
    forAddition: function (augendExpression, addendExpression) {
        if (!augendExpression) {
            throw new Error('augend expression is not defined');
        } else if (!addendExpression) {
            throw new Error('addend expression is not defined');
        }

        /**
         * @namespace dice.expression.additionExpression
         * @description An expression that adds two expressions.
         */
        return {
            /**
             * @member {Object} dice.expression.additionExpression#addendExpression
             * @description - The addend expression.
             */
            addendExpression: addendExpression,

            /**
             * @member {Object} dice.expression.additionExpression#augendExpression
             * @description - The augend expression.
             */
            augendExpression: augendExpression,

            /**
             * @function dice.expression.additionExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {additionExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                var augendExpressionResult = augendExpression.evaluate();
                var addendExpressionResult = addendExpression.evaluate();
                return diceExpressionResult.forAddition(
                    augendExpressionResult.value + addendExpressionResult.value,
                    augendExpressionResult,
                    addendExpressionResult
                    );
            },

            /**
             * @member {String} dice.expression.additionExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.ADDITION
        };
    },

    /**
     * @function dice.expression.forArray
     * @summary Creates a new array expression.
     *
     * @param {Array} expressions - The expressions that are the array
     *      elements.
     *
     * @returns {dice.expression.arrayExpression} The new array expression.
     *
     * @throws {Error} If `expressions` is not an array.
     */
    forArray: function (expressions) {
        if (!_.isArray(expressions)) {
            throw new Error('expressions is not an array');
        }

        /**
         * @namespace dice.expression.arrayExpression
         * @description An expression that acts as an array of expressions.
         */
        return {
            /**
             * @function dice.expression.arrayExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {arrayExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                var expressionResults = _.invoke(expressions, 'evaluate');
                var array = _.pluck(expressionResults, 'value');
                return diceExpressionResult.forArray(array, expressionResults);
            },

            /**
             * @member {Object} dice.expression.arrayExpression#expressions
             * @description - The expressions that are the array elements.
             */
            expressions: expressions,

            /**
             * @member {String} dice.expression.arrayExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.ARRAY
        };
    },

    /**
     * @function dice.expression.forConstant
     * @summary Creates a new constant expression.
     *
     * @param {Number} constant - The constant.
     *
     * @returns {dice.expression.constantExpression} The new constant
     *      expression.
     *
     * @throws {Error} If `constant` is not a number.
     */
    forConstant: function (constant) {
        if (!_.isNumber(constant)) {
            throw new Error('constant is not a number');
        }

        /**
         * @namespace dice.expression.constantExpression
         * @description An expression that represents a constant value.
         */
        return {
            /**
             * @member {Number} dice.expression.constantExpression#constant
             * @description - The constant expression value.
             */
            constant: constant,

            /**
             * @function dice.expression.constantExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {constantExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                return diceExpressionResult.forConstant(constant);
            },

            /**
             * @member {String} dice.expression.constantExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.CONSTANT
        };
    },

    /**
     * @function dice.expression.forDie
     * @summary Creates a new die expression.
     *
     * @param {die} die - The die.
     *
     * @returns {dice.expression.dieExpression} The new die expression.
     *
     * @throws {Error} If `die` is not defined.
     */
    forDie: function (die) {
        if (!die) {
            throw new Error('die is not defined');
        }

        /**
         * @namespace dice.expression.dieExpression
         * @description An expression that represents a die.
         */
        return {
            /**
             * @member {die} dice.expression.dieExpression#die
             * @description - The die expression value.
             */
            die: die,

            /**
             * @function dice.expression.dieExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {dieExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                return diceExpressionResult.forDie(die);
            },

            /**
             * @member {String} dice.expression.dieExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.DIE
        };
    },

    /**
     * @function dice.expression.forDivision
     * @summary Creates a new division expression.
     *
     * @param {Object} dividendExpression - The dividend expression.
     * @param {Object} divisorExpression - The divisor expression.
     *
     * @returns {dice.expression.divisionExpression} The new division
     *      expression.
     *
     * @throws {Error} If `dividendExpression` is not defined or if
     *      `divisorExpression` is not defined.
     */
    forDivision: function (dividendExpression, divisorExpression) {
        if (!dividendExpression) {
            throw new Error('dividend expression is not defined');
        } else if (!divisorExpression) {
            throw new Error('divisor expression is not defined');
        }

        /**
         * @namespace dice.expression.divisionExpression
         * @description An expression that divides two expressions.
         */
        return {
            /**
             * @member {Object} dice.expression.divisionExpression#dividendExpression
             * @description - The dividend expression.
             */
            dividendExpression: dividendExpression,

            /**
             * @member {Object} dice.expression.divisionExpression#divisorExpression
             * @description - The divisor expression.
             */
            divisorExpression: divisorExpression,

            /**
             * @function dice.expression.divisionExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {divisionExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                var dividendExpressionResult = dividendExpression.evaluate();
                var divisorExpressionResult = divisorExpression.evaluate();
                return diceExpressionResult.forDivision(
                    dividendExpressionResult.value / divisorExpressionResult.value,
                    dividendExpressionResult,
                    divisorExpressionResult
                    );
            },

            /**
             * @member {String} dice.expression.divisionExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.DIVISION
        };
    },

    /**
     * @function dice.expression.forFunctionCall
     * @summary Creates a new function call expression.
     *
     * @param {String} name - The function name.
     * @param {Function} func - The function.
     * @param {Array} argumentListExpressions - The expressions that represent
     *      the arguments to the function call.
     *
     * @returns {dice.expression.functionCallExpression} The new function call
     *      expression.
     *
     * @throws {Error} If `name` is not defined, or if `func` is not defined,
     *      or if `argumentListExpressions` is not defined.
     */
    forFunctionCall: function (name, func, argumentListExpressions) {
        if (!name) {
            throw new Error('function name is not defined');
        } else if (!func) {
            throw new Error('function is not defined');
        } else if (!argumentListExpressions) {
            throw new Error('function argument list expressions is not defined');
        }

        /**
         * @namespace dice.expression.functionCallExpression
         * @description An expression that calls a function.
         */
        return {
            /**
             * @member {Array} dice.expression.functionCallExpression#argumentListExpressions
             * @description - The expressions that represent the arguments to
             *      the function call.
             */
            argumentListExpressions: argumentListExpressions,

            /**
             * @function dice.expression.functionCallExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {functionCallExpressionResult} The result of evaluating
             *      the expression.
             */
            evaluate: function () {
                var argumentListExpressionResults = _.invoke(argumentListExpressions, 'evaluate');
                var argumentList = _.pluck(argumentListExpressionResults, 'value');
                var returnValue = func.apply(null, argumentList);
                return diceExpressionResult.forFunctionCall(returnValue, name, argumentListExpressionResults);
            },

            /**
             * @member {String} dice.expression.functionCallExpression#name
             * @description - The function name.
             */
            name: name,

            /**
             * @member {String} dice.expression.functionCallExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.FUNCTION_CALL
        };
    },

    /**
     * @function dice.expression.forGroup
     * @summary Creates a new group expression.
     *
     * @param {Object} childExpression - The expression that is grouped.
     *
     * @returns {dice.expression.groupExpression} The new group expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forGroup: function (childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * @namespace dice.expression.groupExpression
         * @description An expression that groups another expression.
         */
        return {
            /**
             * @member {Object} dice.expression.groupExpression#childExpression
             * @description - The expression that is grouped.
             */
            childExpression: childExpression,

            /**
             * @function dice.expression.groupExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {groupExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                return diceExpressionResult.forGroup(childExpression.evaluate());
            },

            /**
             * @member {String} dice.expression.groupExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.GROUP
        };
    },

    /**
     * @function dice.expression.forModulo
     * @summary Creates a new modulo expression.
     *
     * @param {Object} dividendExpression - The dividend expression.
     * @param {Object} divisorExpression - The divisor expression.
     *
     * @returns {dice.expression.moduloExpression} The new modulo expression.
     *
     * @throws {Error} If `dividendExpression` is not defined or if
     *      `divisorExpression` is not defined.
     */
    forModulo: function (dividendExpression, divisorExpression) {
        if (!dividendExpression) {
            throw new Error('dividend expression is not defined');
        } else if (!divisorExpression) {
            throw new Error('divisor expression is not defined');
        }

        /**
         * @namespace dice.expression.moduloExpression
         * @description An expression that modulos two expressions.
         */
        return {
            /**
             * @member {Object} dice.expression.moduloExpression#dividendExpression
             * @description - The dividend expression.
             */
            dividendExpression: dividendExpression,

            /**
             * @member {Object} dice.expression.moduloExpression#divisorExpression
             * @description - The divisor expression.
             */
            divisorExpression: divisorExpression,

            /**
             * @function dice.expression.moduloExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {moduloExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                var dividendExpressionResult = dividendExpression.evaluate();
                var divisorExpressionResult = divisorExpression.evaluate();
                return diceExpressionResult.forModulo(
                    dividendExpressionResult.value % divisorExpressionResult.value,
                    dividendExpressionResult,
                    divisorExpressionResult
                    );
            },

            /**
             * @member {String} dice.expression.moduloExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.MODULO
        };
    },

    /**
     * @function dice.expression.forMultiplication
     * @summary Creates a new multiplication expression.
     *
     * @param {Object} multiplicandExpression - The multiplicand expression.
     * @param {Object} multiplierExpression - The multiplier expression.
     *
     * @returns {dice.expression.multiplicationExpression} The new
     *      multiplication expression.
     *
     * @throws {Error} If `multiplicandExpression` is not defined or if
     *      `multiplierExpression` is not defined.
     */
    forMultiplication: function (multiplicandExpression, multiplierExpression) {
        if (!multiplicandExpression) {
            throw new Error('multiplicand expression is not defined');
        } else if (!multiplierExpression) {
            throw new Error('multiplier expression is not defined');
        }

        /**
         * @namespace dice.expression.multiplicationExpression
         * @description An expression that multiplies two expressions.
         */
        return {
            /**
             * @function dice.expression.multiplicationExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {multiplicationExpressionResult} The result of
             *      evaluating the expression.
             */
            evaluate: function () {
                var multiplicandExpressionResult = multiplicandExpression.evaluate();
                var multiplierExpressionResult = multiplierExpression.evaluate();
                return diceExpressionResult.forMultiplication(
                    multiplicandExpressionResult.value * multiplierExpressionResult.value,
                    multiplicandExpressionResult,
                    multiplierExpressionResult
                    );
            },

            /**
             * @member {Object} dice.expression.multiplicationExpression#multiplicandExpression
             * @description - The multiplicand expression.
             */
            multiplicandExpression: multiplicandExpression,

            /**
             * @member {Object} dice.expression.multiplicationExpression#multiplierExpression
             * @description - The multiplier expression.
             */
            multiplierExpression: multiplierExpression,

            /**
             * @member {String} dice.expression.multiplicationExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.MULTIPLICATION
        };
    },

    /**
     * @function dice.expression.forNegative
     * @summary Creates a new negative expression.
     *
     * @param {Object} childExpression - The expression to be negated.
     *
     * @returns {dice.expression.negativeExpression} The new negative
     *      expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forNegative: function (childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * @namespace dice.expression.negativeExpression
         * @description An expression that negates another expression.
         */
        return {
            /**
             * @member {Object} dice.expression.negativeExpression#childExpression
             * @description - The expression to be negated.
             */
            childExpression: childExpression,

            /**
             * @function dice.expression.negativeExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {negativeExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                return diceExpressionResult.forNegative(childExpression.evaluate());
            },

            /**
             * @member {String} dice.expression.negativeExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.NEGATIVE
        };
    },

    /**
     * @function dice.expression.forPositive
     * @summary Creates a new positive expression.
     *
     * @param {Object} childExpression - The expression to be applied.
     *
     * @returns {dice.expression.positiveExpression} The new positive
     *      expression.
     *
     * @throws {Error} If `childExpression` is not defined.
     */
    forPositive: function (childExpression) {
        if (!childExpression) {
            throw new Error('child expression is not defined');
        }

        /**
         * @namespace dice.expression.positiveExpression
         * @description An expression that applies another expression.
         */
        return {
            /**
             * @member {Object} dice.expression.positiveExpression#childExpression
             * @description - The expression to be applied.
             */
            childExpression: childExpression,

            /**
             * @function dice.expression.positiveExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {positiveExpressionResult} The result of evaluating the
             *      expression.
             */
            evaluate: function () {
                return diceExpressionResult.forPositive(childExpression.evaluate());
            },

            /**
             * @member {String} dice.expression.positiveExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.POSITIVE
        };
    },

    /**
     * @function dice.expression.forSubtraction
     * @summary Creates a new subtraction expression.
     *
     * @param {Object} minuendExpression - The minuend expression.
     * @param {Object} subtrahendExpression - The subtrahend expression.
     *
     * @returns {dice.expression.subtractionExpression} The new subtraction
     *      expression.
     *
     * @throws {Error} If `minuendExpression` is not defined or if
     *      `subtrahendExpression` is not defined.
     */
    forSubtraction: function (minuendExpression, subtrahendExpression) {
        if (!minuendExpression) {
            throw new Error('minuend expression is not defined');
        } else if (!subtrahendExpression) {
            throw new Error('subtrahend expression is not defined');
        }

        /**
         * @namespace dice.expression.subtractionExpression
         * @description An expression that subtracts two expressions.
         */
        return {
            /**
             * @function dice.expression.subtractionExpression#evaluate
             * @summary Evaluates the expression.
             *
             * @returns {subtractionExpressionResult} The result of
             *      evaluating the expression.
             */
            evaluate: function () {
                var minuendExpressionResult = minuendExpression.evaluate();
                var subtrahendExpressionResult = subtrahendExpression.evaluate();
                return diceExpressionResult.forSubtraction(
                    minuendExpressionResult.value - subtrahendExpressionResult.value,
                    minuendExpressionResult,
                    subtrahendExpressionResult
                    );
            },

            /**
             * @member {Object} dice.expression.subtractionExpression#minuendExpression
             * @description - The minuend expression.
             */
            minuendExpression: minuendExpression,

            /**
             * @member {Object} dice.expression.subtractionExpression#subtrahendExpression
             * @description - The subtrahend expression.
             */
            subtrahendExpression: subtrahendExpression,

            /**
             * @member {String} dice.expression.subtractionExpression#typeId
             * @description - The expression type identifier.
             */
            typeId: diceExpressionTypeIds.SUBTRACTION
        };
    }
};

module.exports = expression;

