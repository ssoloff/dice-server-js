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

    beforeEach(function () {
        randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
        diceBag = new DiceBag(randomNumberGenerator);
        dice = new Dice();
    });

    describe("#roll", function () {
        var d3;

        beforeEach(function () {
            d3 = diceBag.d(3);
        });

        it("should roll die specified number of times and sum the rolls", function () {
            var rollCount = 0;
            randomNumberGenerator.and.callFake(function () {
                rollCount += 1;
                if (rollCount === 1) {
                    return 0.01;
                } else if (rollCount === 2) {
                    return 0.5;
                } else {
                    return 0.99;
                }
            });
            expect(dice.roll(3, d3)).toBe(6);
        });

        it("should return zero when count is zero", function () {
            expect(dice.roll(0, d3)).toBe(0);
        });
    });
});

