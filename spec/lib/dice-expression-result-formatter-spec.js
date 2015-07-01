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

describe("diceExpressionResultFormatter", function () {
    var three;
    var four;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
    });

    describe(".format", function () {
        describe("when expression result is an addition expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forAddition(7, three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("3 + 4");
            });
        });

        describe("when expression result is a constant expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forConstant(42);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("42");
            });
        });

        describe("when expression result is a die expression result", function () {
            it("should return formatted expression result", function () {
                var d3 = new dice.Bag().d(3);
                var expressionResult = dice.expressionResult.forDie(d3);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("d3");
            });
        });

        describe("when expression result is a division expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forDivision(0.75, three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("3 / 4");
            });
        });

        describe("when expression is a function call expression", function () {
            describe("when zero arguments specified", function () {
                it("should return formatted expression result", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall(0, "f", []);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe("[f(): 0]");
                });
            });

            describe("when one argument specified", function () {
                it("should return formatted expression result", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall(1, "f", [three]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe("[f(3): 1]");
                });
            });

            describe("when two arguments specified", function () {
                it("should return formatted expression result", function () {
                    var expressionResult = dice.expressionResult.forFunctionCall(2, "f", [three, four]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe("[f(3, 4): 2]");
                });
            });
        });

        describe("when expression result is a group expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forGroup(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("(3)");
            });
        });

        describe("when expression result is a multiplication expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forMultiplication(12, three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("3 * 4");
            });
        });

        describe("when expression result is a negative expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forNegative(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("-3");
            });
        });

        describe("when expression result is a positive expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forPositive(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("+3");
            });
        });

        describe("when expression result is a subtraction expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = dice.expressionResult.forSubtraction(-1, three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe("3 - 4");
            });
        });

        describe("when expression result is of an unknown type", function () {
            it("should throw an exception", function () {
                expect(function () {
                    dice.expressionResultFormatter.format({
                        typeId: "__unknown__"
                    });
                }).toThrow();
            });
        });
    });
});

