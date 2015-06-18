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

var diceExpressionResult = require("./dice-expression-result");

function createAdditionExpression(augendExpression, addendExpression) {
    function evaluate() {
        return diceExpressionResult.forAddition(
            diceExpressionResult.for(augendExpression),
            diceExpressionResult.for(addendExpression)
            );
    }
    var expression = function () {
        return evaluate();
    };
    expression.addendExpression = addendExpression;
    expression.augendExpression = augendExpression;
    expression.evaluate = evaluate;
    expression.typeId = "addition";
    return expression;
}

function createConstantExpression(constant) {
    function evaluate() {
        return diceExpressionResult.forConstant(constant);
    }
    var expression = function () {
        return evaluate();
    };
    expression.constant = constant;
    expression.evaluate = evaluate;
    expression.typeId = "constant";
    return expression;
}

function createRollExpression(count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }

    function evaluate() {
        return diceExpressionResult.forRoll(count, die);
    }
    var expression = function () {
        return evaluate();
    };
    expression.count = count;
    expression.die = die;
    expression.evaluate = evaluate;
    expression.typeId = "roll";
    return expression;
}

function createSubtractionExpression(minuendExpression, subtrahendExpression) {
    function evaluate() {
        return diceExpressionResult.forSubtraction(
            diceExpressionResult.for(minuendExpression),
            diceExpressionResult.for(subtrahendExpression)
            );
    }
    var expression = function () {
        return evaluate();
    };
    expression.evaluate = evaluate;
    expression.minuendExpression = minuendExpression;
    expression.subtrahendExpression = subtrahendExpression;
    expression.typeId = "subtraction";
    return expression;
}

module.exports.forAddition = createAdditionExpression;
module.exports.forConstant = createConstantExpression;
module.exports.forRoll = createRollExpression;
module.exports.forSubtraction = createSubtractionExpression;

