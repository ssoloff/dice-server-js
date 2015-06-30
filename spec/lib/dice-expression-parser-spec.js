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

require("../../lib/math-polyfills");

var dice = require("../../lib/dice");
var diceExpressionFunctions = require("../../lib/dice-expression-functions");
var diceTest = require("./dice-test");

describe("diceExpressionParser", function () {
    var expressionParser;
    var expressionParserContext;
    var f = Math.max;
    var one;
    var two;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(diceTest.isDiceExpressionEqual);
        expressionParserContext = dice.expressionParser.createDefaultContext();
        expressionParserContext.functions.f = f;
        expressionParser = dice.expressionParser.create(expressionParserContext);
        one = dice.expression.forConstant(1);
        two = dice.expression.forConstant(2);
    });

    describe(".create", function () {
        it("should use the dice bag in the context", function () {
            expressionParserContext.bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne();
            var expression = expressionParser.parse("3d6");
            expect(expression.evaluate()).toBeExpressionResultWithValue(3);
        });
    });

    describe("#parse", function () {
        describe("when source empty", function () {
            it("should throw exception", function () {
                expect(function () {
                    expressionParser.parse("");
                }).toThrow();
            });
        });

        describe("literals", function () {
            it("should parse an integer literal", function () {
                expect(expressionParser.parse("2")).toEqual(two);
            });
        });

        describe("arithmetic operators", function () {
            it("should parse the addition of two constants", function () {
                expect(expressionParser.parse("1 + 2")).toEqual(dice.expression.forAddition(one, two));
            });

            it("should parse the subtraction of two constants", function () {
                expect(expressionParser.parse("1 - 2")).toEqual(dice.expression.forSubtraction(one, two));
            });

            it("should parse the multiplication of two constants", function () {
                expect(expressionParser.parse("1 * 2")).toEqual(dice.expression.forMultiplication(one, two));
            });

            it("should parse the division of two constants", function () {
                expect(expressionParser.parse("1 / 2")).toEqual(dice.expression.forDivision(one, two));
            });
        });

        describe("dice rolls", function () {
            it("should parse a dice roll with an explicit count", function () {
                expect(expressionParser.parse("3d6")).toEqual(
                    dice.expression.forFunctionCall("sum", diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall("roll", diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ])
                    ])
                );
            });

            it("should parse a dice roll with an implicit count", function () {
                expect(expressionParser.parse("d6")).toEqual(
                    dice.expression.forFunctionCall("sum", diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall("roll", diceExpressionFunctions.roll, [
                            dice.expression.forConstant(1),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ])
                    ])
                );
            });

            it("should parse a percentile dice roll", function () {
                expect(expressionParser.parse("2d%")).toEqual(
                    dice.expression.forFunctionCall("sum", diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall("roll", diceExpressionFunctions.roll, [
                            dice.expression.forConstant(2),
                            dice.expression.forDie(expressionParserContext.bag.d(100))
                        ])
                    ])
                );
            });
        });

        describe("function calls", function () {
            it("should parse a function call with zero arguments", function () {
                expect(expressionParser.parse("f()")).toEqual(dice.expression.forFunctionCall("f", f, []));
            });

            it("should parse a function call with one argument", function () {
                expect(expressionParser.parse("f(1)")).toEqual(dice.expression.forFunctionCall("f", f, [one]));
            });

            it("should parse a function call with two arguments", function () {
                expect(expressionParser.parse("f(1, 2)")).toEqual(dice.expression.forFunctionCall("f", f, [one, two]));
            });
        });

        describe("built-in functions", function () {
            describe("when context contains a function with the same name as a built-in function", function () {
                it("should use the function from the context", function () {
                    expressionParserContext.functions.ceil = function () {
                        return 42;
                    };
                    var expression = expressionParser.parse("ceil(1)");
                    expect(expression.evaluate()).toBeExpressionResultWithValue(42);
                });
            });

            it("should parse the built-in ceil() function", function () {
                expect(expressionParser.parse("ceil(1)")).toEqual(dice.expression.forFunctionCall("ceil", Math.ceil, [one]));
            });

            it("should parse the built-in floor() function", function () {
                expect(expressionParser.parse("floor(1)")).toEqual(dice.expression.forFunctionCall("floor", Math.floor, [one]));
            });

            it("should parse the built-in round() function", function () {
                expect(expressionParser.parse("round(1)")).toEqual(dice.expression.forFunctionCall("round", Math.round, [one]));
            });

            it("should parse the built-in trunc() function", function () {
                expect(expressionParser.parse("trunc(1)")).toEqual(dice.expression.forFunctionCall("trunc", Math.trunc, [one]));
            });
        });
    });
});

