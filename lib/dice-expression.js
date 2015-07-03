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

function createAdditionExpression(augendExpression, addendExpression) {
    if (!augendExpression) {
        throw new Error('augend expression is not defined');
    } else if (!addendExpression) {
        throw new Error('addend expression is not defined');
    }

    return {
        addendExpression: addendExpression,
        augendExpression: augendExpression,
        evaluate: function () {
            var augendExpressionResult = augendExpression.evaluate();
            var addendExpressionResult = addendExpression.evaluate();
            return diceExpressionResult.forAddition(
                augendExpressionResult.value + addendExpressionResult.value,
                augendExpressionResult,
                addendExpressionResult
                );
        },
        typeId: diceExpressionTypeIds.ADDITION
    };
}

function createArrayExpression(expressions) {
    if (!_.isArray(expressions)) {
        throw new Error('expressions is not an array');
    }

    return {
        evaluate: function () {
            var expressionResults = _.invoke(expressions, 'evaluate');
            var array = _.pluck(expressionResults, 'value');
            return diceExpressionResult.forArray(array, expressionResults);
        },
        expressions: expressions,
        typeId: diceExpressionTypeIds.ARRAY
    };
}

function createConstantExpression(constant) {
    if (typeof constant !== 'number') {
        throw new Error('constant is not a number');
    }

    return {
        constant: constant,
        evaluate: function () {
            return diceExpressionResult.forConstant(constant);
        },
        typeId: diceExpressionTypeIds.CONSTANT
    };
}

function createDieExpression(die) {
    if (!die) {
        throw new Error('die is not defined');
    }

    return {
        die: die,
        evaluate: function () {
            return diceExpressionResult.forDie(die);
        },
        typeId: diceExpressionTypeIds.DIE
    };
}

function createDivisionExpression(dividendExpression, divisorExpression) {
    if (!dividendExpression) {
        throw new Error('dividend expression is not defined');
    } else if (!divisorExpression) {
        throw new Error('divisor expression is not defined');
    }

    return {
        dividendExpression: dividendExpression,
        divisorExpression: divisorExpression,
        evaluate: function () {
            var dividendExpressionResult = dividendExpression.evaluate();
            var divisorExpressionResult = divisorExpression.evaluate();
            return diceExpressionResult.forDivision(
                dividendExpressionResult.value / divisorExpressionResult.value,
                dividendExpressionResult,
                divisorExpressionResult
                );
        },
        typeId: diceExpressionTypeIds.DIVISION
    };
}

function createFunctionCallExpression(name, func, argumentListExpressions) {
    if (!name) {
        throw new Error('function name is not defined');
    } else if (!func) {
        throw new Error('function is not defined');
    } else if (!argumentListExpressions) {
        throw new Error('function argument list expressions is not defined');
    }

    return {
        argumentListExpressions: argumentListExpressions,
        evaluate: function () {
            var argumentListExpressionResults = _.invoke(argumentListExpressions, 'evaluate');
            var argumentList = _.pluck(argumentListExpressionResults, 'value');
            var returnValue = func.apply(null, argumentList);
            return diceExpressionResult.forFunctionCall(returnValue, name, argumentListExpressionResults);
        },
        name: name,
        typeId: diceExpressionTypeIds.FUNCTION_CALL
    };
}

function createGroupExpression(childExpression) {
    if (!childExpression) {
        throw new Error('child expression is not defined');
    }

    return {
        childExpression: childExpression,
        evaluate: function () {
            return diceExpressionResult.forGroup(childExpression.evaluate());
        },
        typeId: diceExpressionTypeIds.GROUP
    };
}

function createMultiplicationExpression(multiplicandExpression, multiplierExpression) {
    if (!multiplicandExpression) {
        throw new Error('multiplicand expression is not defined');
    } else if (!multiplierExpression) {
        throw new Error('multiplier expression is not defined');
    }

    return {
        evaluate: function () {
            var multiplicandExpressionResult = multiplicandExpression.evaluate();
            var multiplierExpressionResult = multiplierExpression.evaluate();
            return diceExpressionResult.forMultiplication(
                multiplicandExpressionResult.value * multiplierExpressionResult.value,
                multiplicandExpressionResult,
                multiplierExpressionResult
                );
        },
        multiplicandExpression: multiplicandExpression,
        multiplierExpression: multiplierExpression,
        typeId: diceExpressionTypeIds.MULTIPLICATION
    };
}

function createNegativeExpression(childExpression) {
    if (!childExpression) {
        throw new Error('child expression is not defined');
    }

    return {
        childExpression: childExpression,
        evaluate: function () {
            return diceExpressionResult.forNegative(childExpression.evaluate());
        },
        typeId: diceExpressionTypeIds.NEGATIVE
    };
}

function createPositiveExpression(childExpression) {
    if (!childExpression) {
        throw new Error('child expression is not defined');
    }

    return {
        childExpression: childExpression,
        evaluate: function () {
            return diceExpressionResult.forPositive(childExpression.evaluate());
        },
        typeId: diceExpressionTypeIds.POSITIVE
    };
}

function createSubtractionExpression(minuendExpression, subtrahendExpression) {
    if (!minuendExpression) {
        throw new Error('minuend expression is not defined');
    } else if (!subtrahendExpression) {
        throw new Error('subtrahend expression is not defined');
    }

    return {
        evaluate: function () {
            var minuendExpressionResult = minuendExpression.evaluate();
            var subtrahendExpressionResult = subtrahendExpression.evaluate();
            return diceExpressionResult.forSubtraction(
                minuendExpressionResult.value - subtrahendExpressionResult.value,
                minuendExpressionResult,
                subtrahendExpressionResult
                );
        },
        minuendExpression: minuendExpression,
        subtrahendExpression: subtrahendExpression,
        typeId: diceExpressionTypeIds.SUBTRACTION
    };
}

module.exports.forAddition = createAdditionExpression;
module.exports.forArray = createArrayExpression;
module.exports.forConstant = createConstantExpression;
module.exports.forDie = createDieExpression;
module.exports.forDivision = createDivisionExpression;
module.exports.forFunctionCall = createFunctionCallExpression;
module.exports.forGroup = createGroupExpression;
module.exports.forMultiplication = createMultiplicationExpression;
module.exports.forNegative = createNegativeExpression;
module.exports.forPositive = createPositiveExpression;
module.exports.forSubtraction = createSubtractionExpression;

