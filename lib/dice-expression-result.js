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

var _ = require("underscore");

function createAdditionExpressionResult(augendResult, addendResult) {
    return {
        value: function () {
            return augendResult.value() + addendResult.value();
        }
    };
}

function createConstantExpressionResult(constant) {
    return {
        value: function () {
            return constant;
        }
    };
}

function createExpressionResult(expression) {
    switch (expression.typeId) {
        case "addition":
            return createAdditionExpressionResult(expression.augendExpression, expression.addendExpression);

        case "constant":
            return createConstantExpressionResult(expression.constant);

        case "roll":
            return createRollExpressionResult(expression.count, expression.die);

        case "subtraction":
            return createSubtractionExpressionResult(expression.minuendExpression, expression.subtrahendExpression);

        default:
            throw new Error("unknown expression type: '" + expression.typeId + "'");
    }
}

function createRollExpressionResult(count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }

    function adapter() {
        return createSingleRollExpressionResult(die.roll());
    }
    return _(count).times(adapter).reduce(createAdditionExpressionResult);
}

function createSingleRollExpressionResult(roll) {
    return {
        value: function () {
            return roll;
        }
    };
}

function createSubtractionExpressionResult(minuendResult, subtrahendResult) {
    return {
        value: function () {
            return minuendResult.value() - subtrahendResult.value();
        }
    };
}

module.exports.for = createExpressionResult;
module.exports.forAddition = createAdditionExpressionResult;
module.exports.forConstant = createConstantExpressionResult;
module.exports.forRoll = createRollExpressionResult;
module.exports.forSubtraction = createSubtractionExpressionResult;

