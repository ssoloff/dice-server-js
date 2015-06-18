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

var DiceExpressionResult = require("../lib/dice-expression-result");
var DiceExpressionResultFormatter = require("../lib/dice-expression-result-formatter");
var DiceTestUtils = require("./dice-test-utils");

describe("DiceExpressionResultFormatter", function () {
    var d3;
    var three;
    var four;

    beforeEach(function () {
        d3 = DiceTestUtils.createDieThatRollsEachSideSuccessively(3);
        three = DiceExpressionResult.forConstant(3);
        four = DiceExpressionResult.forConstant(4);
    });

    describe("#format", function () {
        describe("when expression result is an addition expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = DiceExpressionResult.forAddition(three, four);
                expect(DiceExpressionResultFormatter.format(expressionResult)).toBe("3 + 4");
            });
        });

        describe("when expression result is a constant expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = DiceExpressionResult.forConstant(42);
                expect(DiceExpressionResultFormatter.format(expressionResult)).toBe("42");
            });
        });

        describe("when expression result is a roll expression result", function () {
            describe("when count is equal to one", function () {
                it("should return formatted expression result", function () {
                    var expressionResult = DiceExpressionResult.forRoll(1, d3);
                    expect(DiceExpressionResultFormatter.format(expressionResult)).toBe("1 [d3]");
                });
            });

            describe("when count is greater than one", function () {
                it("should return formatted expression result", function () {
                    var expressionResult = DiceExpressionResult.forRoll(4, d3);
                    expect(DiceExpressionResultFormatter.format(expressionResult)).toBe("1 [d3] + 2 [d3] + 3 [d3] + 1 [d3]");
                });
            });
        });

        describe("when expression result is a subtraction expression result", function () {
            it("should return formatted expression result", function () {
                var expressionResult = DiceExpressionResult.forSubtraction(three, four);
                expect(DiceExpressionResultFormatter.format(expressionResult)).toBe("3 - 4");
            });
        });

        describe("when expression result is of an unknown type", function () {
            it("should throw an exception", function () {
                function formatUnknownExpressionResult() {
                    var expressionResult = {
                        typeId: "__unknown__"
                    };
                    DiceExpressionResultFormatter.format(expressionResult);
                }
                expect(formatUnknownExpressionResult).toThrow();
            });
        });
    });
});

