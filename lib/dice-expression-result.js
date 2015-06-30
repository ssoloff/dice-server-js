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

var diceExpressionTypeIds = require("./dice-expression-type-ids");

function createAdditionExpressionResult(augendExpressionResult, addendExpressionResult) {
    if (!augendExpressionResult) {
        throw new Error("augend expression result is not defined");
    } else if (!addendExpressionResult) {
        throw new Error("addend expression result is not defined");
    }

    return {
        addendExpressionResult: addendExpressionResult,
        augendExpressionResult: augendExpressionResult,
        typeId: diceExpressionTypeIds.ADDITION,
        value: function () {
            return augendExpressionResult.value() + addendExpressionResult.value();
        }
    };
}

function createConstantExpressionResult(constant) {
    if (typeof constant !== "number") {
        throw new Error("constant is not a number");
    }

    return {
        constant: constant,
        typeId: diceExpressionTypeIds.CONSTANT,
        value: function () {
            return constant;
        }
    };
}

function createDieExpressionResult(die) {
    if (!die) {
        throw new Error("die is not defined");
    }

    return {
        die: die,
        typeId: diceExpressionTypeIds.DIE,
        value: function () {
            return die;
        }
    };
}

function createDivisionExpressionResult(dividendExpressionResult, divisorExpressionResult) {
    if (!dividendExpressionResult) {
        throw new Error("dividend expression result is not defined");
    } else if (!divisorExpressionResult) {
        throw new Error("divisor expression result is not defined");
    }

    return {
        dividendExpressionResult: dividendExpressionResult,
        divisorExpressionResult: divisorExpressionResult,
        typeId: diceExpressionTypeIds.DIVISION,
        value: function () {
            return dividendExpressionResult.value() / divisorExpressionResult.value();
        }
    };
}

function createFunctionCallExpressionResult(name, argumentListExpressionResults, value) {
    if (!name) {
        throw new Error("name is not defined");
    } else if (!argumentListExpressionResults) {
        throw new Error("argument list expression results is not defined");
    }

    return {
        argumentListExpressionResults: argumentListExpressionResults,
        name: name,
        typeId: diceExpressionTypeIds.FUNCTION_CALL,
        value: function () {
            return value;
        }
    };
}

function createMultiplicationExpressionResult(multiplicandExpressionResult, multiplierExpressionResult) {
    if (!multiplicandExpressionResult) {
        throw new Error("multiplicand expression result is not defined");
    } else if (!multiplierExpressionResult) {
        throw new Error("multiplier expression result is not defined");
    }

    return {
        multiplicandExpressionResult: multiplicandExpressionResult,
        multiplierExpressionResult: multiplierExpressionResult,
        typeId: diceExpressionTypeIds.MULTIPLICATION,
        value: function () {
            return multiplicandExpressionResult.value() * multiplierExpressionResult.value();
        }
    };
}

function createSubtractionExpressionResult(minuendExpressionResult, subtrahendExpressionResult) {
    if (!minuendExpressionResult) {
        throw new Error("minuend expression result is not defined");
    } else if (!subtrahendExpressionResult) {
        throw new Error("subtrahend expression result is not defined");
    }

    return {
        minuendExpressionResult: minuendExpressionResult,
        subtrahendExpressionResult: subtrahendExpressionResult,
        typeId: diceExpressionTypeIds.SUBTRACTION,
        value: function () {
            return minuendExpressionResult.value() - subtrahendExpressionResult.value();
        }
    };
}

module.exports.forAddition = createAdditionExpressionResult;
module.exports.forConstant = createConstantExpressionResult;
module.exports.forDie = createDieExpressionResult;
module.exports.forDivision = createDivisionExpressionResult;
module.exports.forFunctionCall = createFunctionCallExpressionResult;
module.exports.forMultiplication = createMultiplicationExpressionResult;
module.exports.forSubtraction = createSubtractionExpressionResult;

