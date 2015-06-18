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
var DiceExpressionResult = require("./dice-expression-result");

function createAdditionExpression(augendExpression, addendExpression) {
    function evaluate() {
        var augend = augendExpression();
        var addend = addendExpression();
        return DiceExpressionResult
            .fromSource(augend.source + "+" + addend.source)
            .withValue(augend.value + addend.value);
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

function createConstantExpression(value) {
    function evaluate() {
        return DiceExpressionResult.fromSource(value.toString()).withValue(value);
    }
    var expression = function () {
        return evaluate();
    };
    expression.evaluate = evaluate;
    expression.typeId = "constant";
    expression.value = value;
    return expression;
}

function createRollExpression(count, die) {
    if (count < 1) {
        throw new RangeError("count must be positive");
    }

    function formatDie(die) {
        return "d" + die.sides.toString();
    }
    function evaluate() {
        function adapter() {
            return DiceExpressionResult.fromSource(formatDie(die)).withValue(die.roll());
        }
        return _(count).times(_.constant(adapter)).reduce(createAdditionExpression)();
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
        var minuend = minuendExpression();
        var subtrahend = subtrahendExpression();
        return DiceExpressionResult
            .fromSource(minuend.source + "-" + subtrahend.source)
            .withValue(minuend.value - subtrahend.value);
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

