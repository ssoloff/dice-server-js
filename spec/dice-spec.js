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

describe("Dice", function () {
    var Dice = require("../lib/dice");
    var DiceBag = require("../lib/dice-bag");
    var dice;
    var diceBag;
    var randomNumberGenerator;
    var d3;
    var three;
    var four;

    beforeEach(function () {
        randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
        diceBag = new DiceBag(randomNumberGenerator);
        dice = new Dice();

        var rollCount = 0;
        randomNumberGenerator.and.callFake(function () {
            var randomNumbers = [0.1, 0.5, 0.9];
            var roll = randomNumbers[rollCount];
            rollCount = (rollCount + 1) % randomNumbers.length;
            return roll;
        });
        d3 = diceBag.d(3);

        three = dice.constant(3);
        four = dice.constant(4);
    });

    describe("#add", function () {
        it("should return source equal to <augend>+<addend>", function () {
            expect(dice.add(four, three).source).toBe("4+3");
        });

        it("should return value equal to sum of augend and addend", function () {
            expect(dice.add(four, three).value).toBe(7);
            expect(dice.add(three, four).value).toBe(7);
        });
    });

    describe("#constant", function () {
        it("should return source equal to value", function () {
            expect(dice.constant(5).source).toBe("5");
        });

        it("should return value equal to value", function () {
            expect(dice.constant(5).value).toBe(5);
        });
    });

    describe("#roll", function () {
        beforeEach(function () {
        });

        describe("when count less than one", function () {
            it("should throw an exception", function () {
                var MIN_SAFE_INTEGER = -9007199254740991;
                var roll = function (count) {
                    return function () {
                        dice.roll(count, d3);
                    };
                };
                expect(roll(0)).toThrowError(RangeError);
                expect(roll(-1)).toThrowError(RangeError);
                expect(roll(MIN_SAFE_INTEGER)).toThrowError(RangeError);
            });
        });

        describe("when count equals one", function () {
            it("should return source equal to d<sides>", function () {
                expect(dice.roll(1, d3).source).toBe("d3");
            });

            it("should return value equal to roll", function () {
                expect(dice.roll(1, d3).value).toBe(1);
            });
        });

        describe("when count greater than one", function () {
            it("should return source equal to d<sides>+d<sides>+...", function () {
                expect(dice.roll(3, d3).source).toBe("d3+d3+d3");
            });

            it("should return value equal to sum of rolls", function () {
                expect(dice.roll(3, d3).value).toBe(6);
            });
        });
    });

    describe("#subtract", function () {
        it("should return source equal to <minuend>-<subtrahend>", function () {
            expect(dice.subtract(four, three).source).toBe("4-3");
        });

        it("should return value equal to difference between minuend and subtrahend", function () {
            expect(dice.subtract(four, three).value).toBe(1);
            expect(dice.subtract(three, four).value).toBe(-1);
        });
    });
});

