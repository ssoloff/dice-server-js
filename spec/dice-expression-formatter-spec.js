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

var dice = require("../lib/dice");

describe("diceExpressionFormatter", function () {
    var d3;
    var three;
    var four;

    beforeEach(function () {
        var bag = new dice.Bag();
        d3 = bag.d(3);
        three = dice.expression.forConstant(3);
        four = dice.expression.forConstant(4);
    });

    describe(".format", function () {
        describe("when expression is an addition expression", function () {
            it("should return formatted expression", function () {
                var expression = dice.expression.forAddition(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe("3 + 4");
            });
        });

        describe("when expression is a constant expression", function () {
            it("should return formatted expression", function () {
                var expression = dice.expression.forConstant(42);
                expect(dice.expressionFormatter.format(expression)).toBe("42");
            });
        });

        describe("when expression is a roll expression", function () {
            describe("when count is equal to one", function () {
                it("should return formatted expression", function () {
                    var expression = dice.expression.forRoll(1, d3);
                    expect(dice.expressionFormatter.format(expression)).toBe("d3");
                });
            });

            describe("when count is greater than one", function () {
                it("should return formatted expression", function () {
                    var expression = dice.expression.forRoll(4, d3);
                    expect(dice.expressionFormatter.format(expression)).toBe("4d3");
                });
            });
        });

        describe("when expression is a subtraction expression", function () {
            it("should return formatted expression", function () {
                var expression = dice.expression.forSubtraction(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe("3 - 4");
            });
        });

        describe("when expression is of an unknown type", function () {
            it("should throw an exception", function () {
                function formatUnknownExpression() {
                    var expression = {
                        typeId: "__unknown__"
                    };
                    dice.expressionFormatter.format(expression);
                }
                expect(formatUnknownExpression).toThrow();
            });
        });
    });
});

