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
var dice = require("../../lib/dice");

describe("diceExpressionResult", function () {
    var three;
    var four;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
    });

    describe(".forAddition", function () {
        describe("when augend expression result is falsy", function () {
            it("should throw exception", function () {
                function createAdditionExpressionResult() {
                    dice.expressionResult.forAddition(undefined, three);
                }
                expect(createAdditionExpressionResult).toThrow();
            });
        });

        describe("when addend expression result is falsy", function () {
            it("should throw exception", function () {
                function createAdditionExpressionResult() {
                    dice.expressionResult.forAddition(four, undefined);
                }
                expect(createAdditionExpressionResult).toThrow();
            });
        });

        describe(".value", function () {
            it("should return the sum of the augend and the addend", function () {
                var expressionResult = dice.expressionResult.forAddition(three, four);
                expect(expressionResult.value()).toBe(7);
            });
        });
    });

    describe(".forConstant", function () {
        describe("when constant is not a number", function () {
            it("should throw exception", function () {
                function createConstantExpressionResult(constant) {
                    return function () {
                        dice.expressionResult.forConstant(constant);
                    };
                }
                expect(createConstantExpressionResult(undefined)).toThrow();
                expect(createConstantExpressionResult("3")).toThrow();
            });
        });

        describe(".value", function () {
            it("should return the value of the result", function () {
                var expressionResult = dice.expressionResult.forConstant(42);
                expect(expressionResult.value()).toBe(42);
            });
        });
    });

    describe(".forDivision", function () {
        describe("when dividend expression result is falsy", function () {
            it("should throw exception", function () {
                function createDivisionExpressionResult() {
                    dice.expressionResult.forDivision(undefined, three);
                }
                expect(createDivisionExpressionResult).toThrow();
            });
        });

        describe("when divisor expression result is falsy", function () {
            it("should throw exception", function () {
                function createDivisionExpressionResult() {
                    dice.expressionResult.forDivision(four, undefined);
                }
                expect(createDivisionExpressionResult).toThrow();
            });
        });

        describe(".value", function () {
            it("should return the quotient of the dividend and the divisor", function () {
                var expressionResult = dice.expressionResult.forDivision(three, four);
                expect(expressionResult.value()).toBe(0.75);
            });
        });
    });

    describe(".forFunctionCall", function () {
        function f() {
            function sum(first, second) {
                return first + second;
            }
            return 42 + _.toArray(arguments).reduce(sum, 0);
        }

        describe("when function name is falsy", function () {
            it("should throw exception", function () {
                function createFunctionCallExpressionResult() {
                    dice.expressionResult.forFunctionCall(undefined, f, []);
                }
                expect(createFunctionCallExpressionResult).toThrow();
            });
        });

        describe("when function is falsy", function () {
            it("should throw exception", function () {
                function createFunctionCallExpressionResult() {
                    dice.expressionResult.forFunctionCall("f", undefined, []);
                }
                expect(createFunctionCallExpressionResult).toThrow();
            });
        });

        describe("when function argument list expression results is falsy", function () {
            it("should throw exception", function () {
                function createFunctionCallExpressionResult() {
                    dice.expressionResult.forFunctionCall("f", f, undefined);
                }
                expect(createFunctionCallExpressionResult).toThrow();
            });
        });

        describe(".value", function () {
            describe("when zero arguments specified", function () {
                it("should return the function return value", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall("f", f, []);
                    expect(expressionResult.value()).toBe(42);
                });
            });

            describe("when one argument specified", function () {
                it("should return the function return value", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall("f", f, [three]);
                    expect(expressionResult.value()).toBe(45);
                });
            });

            describe("when two arguments specified", function () {
                it("should return the function return value", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall("f", f, [three, four]);
                    expect(expressionResult.value()).toBe(49);
                });
            });
        });
    });

    describe(".forMultiplication", function () {
        describe("when multiplicand expression result is falsy", function () {
            it("should throw exception", function () {
                function createMultiplicationExpressionResult() {
                    dice.expressionResult.forMultiplication(undefined, three);
                }
                expect(createMultiplicationExpressionResult).toThrow();
            });
        });

        describe("when multiplier expression result is falsy", function () {
            it("should throw exception", function () {
                function createMultiplicationExpressionResult() {
                    dice.expressionResult.forMultiplication(four, undefined);
                }
                expect(createMultiplicationExpressionResult).toThrow();
            });
        });

        describe(".value", function () {
            it("should return the product of the multiplicand and the multiplier", function () {
                var expressionResult = dice.expressionResult.forMultiplication(three, four);
                expect(expressionResult.value()).toBe(12);
            });
        });
    });

    describe(".forRoll", function () {
        describe("when rolls has less than one element", function () {
            it("should throw exception", function () {
                function createRollExpressionResult(rolls) {
                    return function () {
                        dice.expressionResult.forRoll(rolls);
                    };
                }
                expect(createRollExpressionResult(undefined)).toThrow();
                expect(createRollExpressionResult([])).toThrow();
            });
        });

        describe(".value", function () {
            describe("when count equals zero", function () {
                it("should throw exception", function () {
                    function createRollExpressionResult() {
                        dice.expressionResult.forRoll([]);
                    }
                    expect(createRollExpressionResult).toThrowError();
                });
            });

            describe("when count equals one", function () {
                it("should return the result of a single die roll", function () {
                    var expressionResult = dice.expressionResult.forRoll([1]);
                    expect(expressionResult.value()).toBe(1);
                });
            });

            describe("when count greater than one", function () {
                it("should return the result of the sum of multiple die rolls", function () {
                    var expressionResult = dice.expressionResult.forRoll([1, 2, 3, 1]);
                    expect(expressionResult.value()).toBe(7);
                });
            });
        });
    });

    describe(".forSubtraction", function () {
        describe("when minuend expression result is falsy", function () {
            it("should throw exception", function () {
                function createSubtractionExpressionResult() {
                    dice.expressionResult.forSubtraction(undefined, three);
                }
                expect(createSubtractionExpressionResult).toThrow();
            });
        });

        describe("when subtrahend expression result is falsy", function () {
            it("should throw exception", function () {
                function createSubtractionExpressionResult() {
                    dice.expressionResult.forSubtraction(four, undefined);
                }
                expect(createSubtractionExpressionResult).toThrow();
            });
        });

        describe(".value", function () {
            it("should return the difference between the minuend and the subtrahend", function () {
                var expressionResult = dice.expressionResult.forSubtraction(three, four);
                expect(expressionResult.value()).toBe(-1);
            });
        });
    });
});

