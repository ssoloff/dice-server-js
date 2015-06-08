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

describe("Dice", function () {
    var Dice = require("../lib/dice");
    var dice;
    var randomNumberGenerator;

    beforeEach(function () {
        randomNumberGenerator = jasmine.createSpy("randomNumberGenerator");
        dice = new Dice(randomNumberGenerator);
    });

    describe("#d", function () {
        var d;

        beforeEach(function () {
            d = dice.d();
        });

        it("should roll 1 when random number is minimum value", function () {
            randomNumberGenerator.and.returnValue(0.0);
            expect(d(6)).toBe(2);
        });

        it("should roll side count when random number is maximum value", function () {
            var EPSILON = 2.2204460492503130808472633361816E-16;
            randomNumberGenerator.and.returnValue(1.0 - EPSILON);
            expect(d(6)).toBe(7);
        });
    });
});

