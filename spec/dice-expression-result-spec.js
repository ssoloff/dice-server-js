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

var DiceBag = require("../lib/dice-bag");
var DiceExpressionResult = require("../lib/dice-expression-result");
var NumberUtils = require("../lib/number-utils");

describe("DiceExpressionResult", function () {
    var d3;
    var three;
    var four;

    beforeEach(function () {
        var rollCount = 0;
        var randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
        randomNumberGenerator.and.callFake(function () {
            var randomNumbers = [0.1, 0.5, 0.9];
            var roll = randomNumbers[rollCount];
            rollCount = (rollCount + 1) % randomNumbers.length;
            return roll;
        });

        var bag = new DiceBag(randomNumberGenerator);
        d3 = bag.d(3);
        three = DiceExpressionResult.forConstant(3);
        four = DiceExpressionResult.forConstant(4);
    });

    describe("#for", function () {
        describe("when expression is of an unknown type", function () {
            it("should throw an exception", function () {
                function createUnknownExpressionResult() {
                    var expression = {
                        typeId: "__unknown__"
                    };
                    DiceExpressionResult.for(expression);
                }
                expect(createUnknownExpressionResult).toThrow();
            });
        });
    });

    describe("#forAddition", function () {
        describe("#value", function () {
            it("should return the sum of the augend and the addend", function () {
                var expressionResult = DiceExpressionResult.forAddition(three, four);
                expect(expressionResult.value()).toBe(7);
            });
        });
    });

    describe("#forConstant", function () {
        describe("#value", function () {
            it("should return the value of the result", function () {
                var expressionResult = DiceExpressionResult.forConstant(42);
                expect(expressionResult.value()).toBe(42);
            });
        });
    });

    describe("#forRoll", function () {
        describe("#value", function () {
            describe("when count less than one", function () {
                it("should throw exception", function () {
                    function createRollExpressionResultWithCount(count) {
                        return function () {
                            DiceExpressionResult.forRoll(count, d3);
                        };
                    }
                    expect(createRollExpressionResultWithCount(0)).toThrowError(RangeError);
                    expect(createRollExpressionResultWithCount(NumberUtils.MIN_SAFE_INTEGER)).toThrowError(RangeError);
                });
            });

            describe("when count equals one", function () {
                it("should return the result of a single die roll", function () {
                    var expressionResult = DiceExpressionResult.forRoll(1, d3);
                    expect(expressionResult.value()).toBe(1);
                });
            });

            describe("when count greater than one", function () {
                it("should return the result of the sum of multiple die rolls", function () {
                    var expressionResult = DiceExpressionResult.forRoll(4, d3);
                    expect(expressionResult.value()).toBe(7);
                });
            });

            it("should return same result for all invocations", function () {
                var expressionResult = DiceExpressionResult.forRoll(1, d3);
                expect(expressionResult.value()).toBe(expressionResult.value());
            });
        });
    });

    describe("#forSubtraction", function () {
        describe("#value", function () {
            it("should return the difference between the minuend and the subtrahend", function () {
                var expressionResult = DiceExpressionResult.forSubtraction(three, four);
                expect(expressionResult.value()).toBe(-1);
            });
        });
    });
});

