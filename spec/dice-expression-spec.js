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
var DiceExpression = require("../lib/dice-expression");
var DiceExpressionResult = require("../lib/dice-expression-result");
var NumberUtils = require("../lib/number-utils");

describe("DiceExpression", function () {
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
        three = DiceExpression.forConstant(3);
        four = DiceExpression.forConstant(4);
    });

    describe("#forAddition", function () {
        it("should return expression that evaluates to sum of augend and addend", function () {
            expect(DiceExpression.forAddition(four, three)).toEvaluateTo(DiceExpressionResult.fromSource("4+3").withValue(7));
            expect(DiceExpression.forAddition(three, four)).toEvaluateTo(DiceExpressionResult.fromSource("3+4").withValue(7));
        });

        describe("#toString", function () {
            it("should return the formatted expression", function () {
                expect(DiceExpression.forAddition(four, three).toString()).toBe("4+3");
            });
        });
    });

    describe("#forConstant", function () {
        it("should return expression that evaluates to constant value", function () {
            expect(DiceExpression.forConstant(5)).toEvaluateTo(DiceExpressionResult.fromSource("5").withValue(5));
        });

        describe("#toString", function () {
            it("should return the formatted expression", function () {
                expect(DiceExpression.forConstant(5).toString()).toBe("5");
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
            it("should return expression that evaluates to single die roll", function () {
                expect(DiceExpression.forRoll(1, d3)).toEvaluateTo(DiceExpressionResult.fromSource("d3").withValue(1));
            });

            describe("#toString", function () {
                it("should return the formatted expression", function () {
                    expect(DiceExpression.forRoll(1, d3).toString()).toBe("d3");
                });
            });
        });

        describe("when count greater than one", function () {
            it("should return expression that evaluates to sum of multiple die rolls", function () {
                expect(DiceExpression.forRoll(3, d3)).toEvaluateTo(DiceExpressionResult.fromSource("d3+d3+d3").withValue(6));
            });

            describe("#toString", function () {
                it("should return the formatted expression", function () {
                    expect(DiceExpression.forRoll(4, d3).toString()).toBe("4d3");
                });
            });
        });
    });

    describe("#forSubtraction", function () {
        it("should return expression that evaluates to difference between minuend and subtrahend", function () {
            expect(DiceExpression.forSubtraction(four, three)).toEvaluateTo(DiceExpressionResult.fromSource("4-3").withValue(1));
            expect(DiceExpression.forSubtraction(three, four)).toEvaluateTo(DiceExpressionResult.fromSource("3-4").withValue(-1));
        });

        describe("#toString", function () {
            it("should return the formatted expression", function () {
                expect(DiceExpression.forSubtraction(four, three).toString()).toBe("4-3");
            });
        });
    });
});

