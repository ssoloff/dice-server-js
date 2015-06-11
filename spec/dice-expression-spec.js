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

describe("diceExpression", function () {
    var DiceBag = require("../lib/dice-bag"),
        diceExpression = require("../lib/dice-expression"),
        d3,
        three,
        four;

    beforeEach(function () {
        var randomNumberGenerator = jasmine.createSpy("randomNumberGenerator"),
            diceBag = new DiceBag(randomNumberGenerator),
            rollCount = 0;
        randomNumberGenerator.and.callFake(function () {
            var randomNumbers = [0.1, 0.5, 0.9],
                roll = randomNumbers[rollCount];
            rollCount = (rollCount + 1) % randomNumbers.length;
            return roll;
        });
        d3 = diceBag.d(3);
        three = diceExpression.constant(3);
        four = diceExpression.constant(4);
    });

    describe("#add", function () {
        it("should return expression that evaluates to sum of augend and addend", function () {
            expect(diceExpression.add(four, three)()).toEqual({source: "4+3", value: 7});
            expect(diceExpression.add(three, four)()).toEqual({source: "3+4", value: 7});
        });
    });

    describe("#constant", function () {
        it("should return expression that evaluates to constant value", function () {
            expect(diceExpression.constant(5)()).toEqual({source: "5", value: 5});
        });
    });

    describe("#roll", function () {
        describe("when count less than one", function () {
            it("should throw exception", function () {
                var MIN_SAFE_INTEGER = -9007199254740991,
                    roll = function (count) {
                        return function () {
                            diceExpression.roll(count, d3);
                        };
                    };
                expect(roll(0)).toThrowError(RangeError);
                expect(roll(-1)).toThrowError(RangeError);
                expect(roll(MIN_SAFE_INTEGER)).toThrowError(RangeError);
            });
        });

        describe("when count equals one", function () {
            it("should return expression that evaluates to single die roll", function () {
                expect(diceExpression.roll(1, d3)()).toEqual({source: "d3", value: 1});
            });
        });

        describe("when count greater than one", function () {
            it("should return expression that evaluates to sum of multiple die rolls", function () {
                expect(diceExpression.roll(3, d3)()).toEqual({source: "d3+d3+d3", value: 6});
            });
        });
    });

    describe("#subtract", function () {
        it("should return expression that evaluates to difference between minuend and subtrahend", function () {
            expect(diceExpression.subtract(four, three)()).toEqual({source: "4-3", value: 1});
            expect(diceExpression.subtract(three, four)()).toEqual({source: "3-4", value: -1});
        });
    });
});

