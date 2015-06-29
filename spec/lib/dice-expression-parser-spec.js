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

describe("diceExpressionParser", function () {
    var expressionParser;
    var expressionParserContext;
    var f = Math.max;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(diceTest.isDiceExpressionEqual);
        expressionParserContext = dice.expressionParser.createDefaultContext();
        expressionParserContext.functions.f = f;
        expressionParser = dice.expressionParser.create(expressionParserContext);
    });

    describe(".create", function () {
        it("should use the dice bag in the context", function () {
            expressionParserContext.bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne();
            var expression = expressionParser.parse("3d6");
            expect(expression.evaluate().value()).toBe(3);
        });
    });

    describe("#parse", function () {
        it("should parse a constant", function () {
            expect(expressionParser.parse("42")).toEqual(dice.expression.forConstant(42));
        });

        it("should parse the addition of two constants", function () {
            expect(expressionParser.parse("3 + 2")).toEqual(
                dice.expression.forAddition(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse the division of two constants", function () {
            expect(expressionParser.parse("3 / 2")).toEqual(
                dice.expression.forDivision(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse the multiplication of two constants", function () {
            expect(expressionParser.parse("3 * 2")).toEqual(
                dice.expression.forMultiplication(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse the subtraction of two constants", function () {
            expect(expressionParser.parse("3 - 2")).toEqual(
                dice.expression.forSubtraction(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse a die roll with an explicit count", function () {
            expect(expressionParser.parse("3d6")).toEqual(dice.expression.forRoll(3, expressionParserContext.bag.d(6)));
        });

        it("should parse a die roll with an implicit count", function () {
            expect(expressionParser.parse("d6")).toEqual(dice.expression.forRoll(1, expressionParserContext.bag.d(6)));
        });

        it("should parse a percentile die roll", function () {
            expect(expressionParser.parse("2d%")).toEqual(dice.expression.forRoll(2, expressionParserContext.bag.d(100)));
        });

        it("should parse a function with zero arguments", function () {
            expect(expressionParser.parse("f()")).toEqual(
                dice.expression.forFunctionCall(
                    "f",
                    f,
                    []
                )
            );
        });

        it("should parse a function with one argument", function () {
            expect(expressionParser.parse("f(1)")).toEqual(
                dice.expression.forFunctionCall(
                    "f",
                    f,
                    [dice.expression.forConstant(1)]
                )
            );
        });

        it("should parse a function with two arguments", function () {
            expect(expressionParser.parse("f(1, 2)")).toEqual(
                dice.expression.forFunctionCall(
                    "f",
                     f,
                     [dice.expression.forConstant(1), dice.expression.forConstant(2)]
                )
            );
        });

        describe("when source empty", function () {
            it("should throw exception", function () {
                function parseEmptySource() {
                    expressionParser.parse("");
                }
                expect(parseEmptySource).toThrow();
            });
        });
    });
});

