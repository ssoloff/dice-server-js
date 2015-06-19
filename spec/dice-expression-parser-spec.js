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
var dice = require("../lib/dice");

describe("diceExpressionParser", function () {
    var bag;

    function isDiceExpressionEqual(first, second) {
        if (_.has(first, "typeId")
                && _.has(first, "evaluate")
                && _.has(second, "typeId")
                && _.has(second, "evaluate")) {
            // do not consider function members when testing for equality
            return JSON.stringify(first) === JSON.stringify(second);
        }
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(isDiceExpressionEqual);
        bag = new dice.Bag();
    });

    describe(".parse", function () {
        it("should parse a constant", function () {
            expect(dice.expressionParser.parse("42")).toEqual(dice.expression.forConstant(42));
        });

        it("should parse the addition of two constants", function () {
            expect(dice.expressionParser.parse("3 + 2")).toEqual(
                dice.expression.forAddition(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse the subtraction of two constants", function () {
            expect(dice.expressionParser.parse("3 - 2")).toEqual(
                dice.expression.forSubtraction(
                    dice.expression.forConstant(3),
                    dice.expression.forConstant(2)
                )
            );
        });

        it("should parse a die roll with an explicit count", function () {
            expect(dice.expressionParser.parse("3d6")).toEqual(dice.expression.forRoll(3, bag.d(6)));
        });

        it("should parse a die roll with an implicit count", function () {
            expect(dice.expressionParser.parse("d6")).toEqual(dice.expression.forRoll(1, bag.d(6)));
        });

        it("should parse a percentile die roll", function () {
            expect(dice.expressionParser.parse("2d%")).toEqual(dice.expression.forRoll(2, bag.d(100)));
        });

        describe("when source empty", function () {
            it("should throw exception", function () {
                function parseEmptySource() {
                    dice.expressionParser.parse("");
                }
                expect(parseEmptySource).toThrow();
            });
        });
    });
});

