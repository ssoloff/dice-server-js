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

var DiceExpression = require("../lib/dice-expression");
var DiceTestUtils = require("./dice-test-utils");
var NumberUtils = require("../lib/number-utils");

describe("DiceExpression", function () {
    var d3;
    var three;
    var four;
    var expression;

    beforeEach(function () {
        d3 = DiceTestUtils.createDieThatRollsEachSideSuccessively(3);
        three = DiceExpression.forConstant(3);
        four = DiceExpression.forConstant(4);
    });

    describe("#forAddition", function () {
        beforeEach(function () {
            expression = DiceExpression.forAddition(four, three);
        });

        describe("#evaluate", function () {
            it("should return result with value equal to sum of augend and addend", function () {
                expect(expression.evaluate()).toBeExpressionResultWithValue(7);
            });
        });

        describe("when evaluated", function () {
            it("should return result with value equal to sum of augend and addend", function () {
                expect(expression()).toBeExpressionResultWithValue(7);
            });
        });
    });

    describe("#forConstant", function () {
        beforeEach(function () {
            expression = DiceExpression.forConstant(5);
        });

        describe("#evaluate", function () {
            it("should return result with value equal to constant", function () {
                expect(expression.evaluate()).toBeExpressionResultWithValue(5);
            });
        });

        describe("when evaluated", function () {
            it("should return result with value equal to constant", function () {
                expect(expression()).toBeExpressionResultWithValue(5);
            });
        });
    });

    describe("#forRoll", function () {
        describe("when count less than one", function () {
            it("should throw exception", function () {
                function createRollExpressionWithCount(count) {
                    return function () {
                        DiceExpression.forRoll(count, d3);
                    };
                }
                expect(createRollExpressionWithCount(0)).toThrowError(RangeError);
                expect(createRollExpressionWithCount(NumberUtils.MIN_SAFE_INTEGER)).toThrowError(RangeError);
            });
        });

        describe("when count equals one", function () {
            beforeEach(function () {
                expression = DiceExpression.forRoll(1, d3);
            });

            describe("#evaluate", function () {
                it("should return result with value equal to single die roll", function () {
                    expect(expression.evaluate()).toBeExpressionResultWithValue(1);
                });
            });
        });

        describe("when count greater than one", function () {
            beforeEach(function () {
                expression = DiceExpression.forRoll(4, d3);
            });

            describe("#evaluate", function () {
                it("should return result with value equal to sum of multiple die rolls", function () {
                    expect(expression.evaluate()).toBeExpressionResultWithValue(7);
                });
            });
        });

        describe("when evaluated", function () {
            it("should return result with value equal to sum of die rolls", function () {
                expression = DiceExpression.forRoll(2, d3);
                expect(expression.evaluate()).toBeExpressionResultWithValue(3);
            });
        });
    });

    describe("#forSubtraction", function () {
        beforeEach(function () {
            expression = DiceExpression.forSubtraction(four, three);
        });

        describe("#evaluate", function () {
            it("should return result with value equal to difference between minuend and subtrahend", function () {
                expect(expression.evaluate()).toBeExpressionResultWithValue(1);
            });
        });

        describe("when evaluated", function () {
            it("should return result with value equal to difference between minuend and subtrahend", function () {
                expect(expression()).toBeExpressionResultWithValue(1);
            });
        });
    });
});

