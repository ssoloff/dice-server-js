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

var dice = require("../../lib/dice");
var diceTest = require("./dice-test");
var numberUtils = require("../../lib/number-utils");

describe("diceExpressionResult", function () {
    var d3;
    var three;
    var four;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(diceTest.isDiceExpressionResultEqual);
        d3 = diceTest.createDieThatRollsEachSideSuccessively(3);
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
    });

    describe(".for", function () {
        describe("when expression is for addition", function () {
            it("should return an expression result for addition", function () {
                var expression = dice.expression.forAddition(dice.expression.forConstant(3), dice.expression.forConstant(4));
                expect(dice.expressionResult.for(expression)).toEqual(dice.expressionResult.forAddition(three, four));
            });
        });

        describe("when expression is for a constant", function () {
            it("should return an expression result for a constant", function () {
                var expression = dice.expression.forConstant(3);
                expect(dice.expressionResult.for(expression)).toEqual(three);
            });
        });

        describe("when expression is for multiplication", function () {
            it("should return an expression result for multiplication", function () {
                var expression = dice.expression.forMultiplication(dice.expression.forConstant(3), dice.expression.forConstant(4));
                expect(dice.expressionResult.for(expression)).toEqual(dice.expressionResult.forMultiplication(three, four));
            });
        });

        describe("when expression is for a roll", function () {
            it("should return an expression result for a roll", function () {
                var d6 = diceTest.createBagThatProvidesDiceThatAlwaysRollOne().d(6);
                var expression = dice.expression.forRoll(2, d6);
                expect(dice.expressionResult.for(expression)).toEqual(dice.expressionResult.forRoll(2, d6));
            });
        });

        describe("when expression is for subtraction", function () {
            it("should return an expression result for subtraction", function () {
                var expression = dice.expression.forSubtraction(dice.expression.forConstant(3), dice.expression.forConstant(4));
                expect(dice.expressionResult.for(expression)).toEqual(dice.expressionResult.forSubtraction(three, four));
            });
        });

        describe("when expression is of an unknown type", function () {
            it("should throw an exception", function () {
                function createUnknownExpressionResult() {
                    var expression = {
                        typeId: "__unknown__"
                    };
                    dice.expressionResult.for(expression);
                }
                expect(createUnknownExpressionResult).toThrow();
            });
        });
    });

    describe(".forAddition", function () {
        describe(".value", function () {
            it("should return the sum of the augend and the addend", function () {
                var expressionResult = dice.expressionResult.forAddition(three, four);
                expect(expressionResult.value()).toBe(7);
            });
        });
    });

    describe(".forConstant", function () {
        describe(".value", function () {
            it("should return the value of the result", function () {
                var expressionResult = dice.expressionResult.forConstant(42);
                expect(expressionResult.value()).toBe(42);
            });
        });
    });

    describe(".forMultiplication", function () {
        describe(".value", function () {
            it("should return the product of the multiplicand and the multiplier", function () {
                var expressionResult = dice.expressionResult.forMultiplication(three, four);
                expect(expressionResult.value()).toBe(12);
            });
        });
    });

    describe(".forRoll", function () {
        describe(".value", function () {
            describe("when count less than one", function () {
                it("should throw exception", function () {
                    function createRollExpressionResultWithCount(count) {
                        return function () {
                            dice.expressionResult.forRoll(count, d3);
                        };
                    }
                    expect(createRollExpressionResultWithCount(0)).toThrowError(RangeError);
                    expect(createRollExpressionResultWithCount(numberUtils.MIN_SAFE_INTEGER)).toThrowError(RangeError);
                });
            });

            describe("when count equals one", function () {
                it("should return the result of a single die roll", function () {
                    var expressionResult = dice.expressionResult.forRoll(1, d3);
                    expect(expressionResult.value()).toBe(1);
                });
            });

            describe("when count greater than one", function () {
                it("should return the result of the sum of multiple die rolls", function () {
                    var expressionResult = dice.expressionResult.forRoll(4, d3);
                    expect(expressionResult.value()).toBe(7);
                });
            });

            it("should return same result for all invocations", function () {
                var expressionResult = dice.expressionResult.forRoll(1, d3);
                expect(expressionResult.value()).toBe(expressionResult.value());
            });
        });
    });

    describe(".forSubtraction", function () {
        describe(".value", function () {
            it("should return the difference between the minuend and the subtrahend", function () {
                var expressionResult = dice.expressionResult.forSubtraction(three, four);
                expect(expressionResult.value()).toBe(-1);
            });
        });
    });
});

