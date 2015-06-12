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

describe("DiceBag", function () {
    var bag;

    beforeEach(function () {
        var randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
        bag = new DiceBag(randomNumberGenerator);
    });

    it("should use a default random number generator", function () {
        bag = new DiceBag();
        expect(bag.d(6)).not.toThrow();
    });

    describe("#d", function () {
        var d6;

        beforeEach(function () {
            d6 = bag.d(6);
        });

        it("should return source equal to d<sides>", function () {
            expect(d6().source).toBe("d6");
        });

        it("should return value equal to 1 when random number is minimum value", function () {
            bag.randomNumberGenerator.and.returnValue(0.0);
            expect(d6().value).toBe(1);
        });

        it("should return value equal to <sides> when random number is maximum value", function () {
            var EPSILON = 2.2204460492503130808472633361816E-16;
            bag.randomNumberGenerator.and.returnValue(1.0 - EPSILON);
            expect(d6().value).toBe(6);
        });
    });
});

