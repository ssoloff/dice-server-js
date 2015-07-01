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

function createAdditionExpressionResult(sum, augendExpressionResult, addendExpressionResult) {
    if (typeof sum !== "number") {
        throw new Error("sum is not a number");
    } else if (!augendExpressionResult) {
        throw new Error("augend expression result is not defined");
    } else if (!addendExpressionResult) {
        throw new Error("addend expression result is not defined");
    }

    return {
        addendExpressionResult: addendExpressionResult,
        augendExpressionResult: augendExpressionResult,
        typeId: diceExpressionTypeIds.ADDITION,
        value: sum
    };
}

function createConstantExpressionResult(constant) {
    if (typeof constant !== "number") {
        throw new Error("constant is not a number");
    }

    return {
        constant: constant,
        typeId: diceExpressionTypeIds.CONSTANT,
        value: constant
    };
}

function createDieExpressionResult(die) {
    if (!die) {
        throw new Error("die is not defined");
    }

    return {
        die: die,
        typeId: diceExpressionTypeIds.DIE,
        value: die
    };
}

function createDivisionExpressionResult(quotient, dividendExpressionResult, divisorExpressionResult) {
    if (typeof quotient !== "number") {
        throw new Error("quotient is not a number");
    } else if (!dividendExpressionResult) {
        throw new Error("dividend expression result is not defined");
    } else if (!divisorExpressionResult) {
        throw new Error("divisor expression result is not defined");
    }

    return {
        dividendExpressionResult: dividendExpressionResult,
        divisorExpressionResult: divisorExpressionResult,
        typeId: diceExpressionTypeIds.DIVISION,
        value: quotient
    };
}

function createFunctionCallExpressionResult(returnValue, name, argumentListExpressionResults) {
    if ((returnValue === undefined) || (returnValue === null)) {
        throw new Error("return value is not defined");
    } else if (!name) {
        throw new Error("name is not defined");
    } else if (!argumentListExpressionResults) {
        throw new Error("argument list expression results is not defined");
    }

    return {
        argumentListExpressionResults: argumentListExpressionResults,
        name: name,
        returnValue: returnValue,
        typeId: diceExpressionTypeIds.FUNCTION_CALL,
        value: returnValue
    };
}

function createGroupExpressionResult(childExpressionResult) {
    if (!childExpressionResult) {
        throw new Error("child expression result is not defined");
    }

    return {
        childExpressionResult: childExpressionResult,
        typeId: diceExpressionTypeIds.GROUP,
        value: childExpressionResult.value
    };
}

function createMultiplicationExpressionResult(product, multiplicandExpressionResult, multiplierExpressionResult) {
    if (typeof product !== "number") {
        throw new Error("product is not a number");
    } else if (!multiplicandExpressionResult) {
        throw new Error("multiplicand expression result is not defined");
    } else if (!multiplierExpressionResult) {
        throw new Error("multiplier expression result is not defined");
    }

    return {
        multiplicandExpressionResult: multiplicandExpressionResult,
        multiplierExpressionResult: multiplierExpressionResult,
        typeId: diceExpressionTypeIds.MULTIPLICATION,
        value: product
    };
}

function createNegativeExpressionResult(childExpressionResult) {
    if (!childExpressionResult) {
        throw new Error("child expression result is not defined");
    }

    return {
        childExpressionResult: childExpressionResult,
        typeId: diceExpressionTypeIds.NEGATIVE,
        value: -childExpressionResult.value
    };
}

function createPositiveExpressionResult(childExpressionResult) {
    if (!childExpressionResult) {
        throw new Error("child expression result is not defined");
    }

    return {
        childExpressionResult: childExpressionResult,
        typeId: diceExpressionTypeIds.POSITIVE,
        value: childExpressionResult.value
    };
}

function createSubtractionExpressionResult(difference, minuendExpressionResult, subtrahendExpressionResult) {
    if (typeof difference !== "number") {
        throw new Error("difference is not a number");
    } else if (!minuendExpressionResult) {
        throw new Error("minuend expression result is not defined");
    } else if (!subtrahendExpressionResult) {
        throw new Error("subtrahend expression result is not defined");
    }

    return {
        minuendExpressionResult: minuendExpressionResult,
        subtrahendExpressionResult: subtrahendExpressionResult,
        typeId: diceExpressionTypeIds.SUBTRACTION,
        value: difference
    };
}

module.exports.forAddition = createAdditionExpressionResult;
module.exports.forConstant = createConstantExpressionResult;
module.exports.forDie = createDieExpressionResult;
module.exports.forDivision = createDivisionExpressionResult;
module.exports.forFunctionCall = createFunctionCallExpressionResult;
module.exports.forGroup = createGroupExpressionResult;
module.exports.forMultiplication = createMultiplicationExpressionResult;
module.exports.forNegative = createNegativeExpressionResult;
module.exports.forPositive = createPositiveExpressionResult;
module.exports.forSubtraction = createSubtractionExpressionResult;

