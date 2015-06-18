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

var diceTest = require("./dice-test");

describe("diceTest", function () {
    describe("#createDieThatRollsEachSideSuccessively", function () {
        describe("when die has 3 sides", function () {
            it("should roll each side successively and rollover to 1", function () {
                var d3 = diceTest.createDieThatRollsEachSideSuccessively(3);
                expect(d3.roll()).toBe(1);
                expect(d3.roll()).toBe(2);
                expect(d3.roll()).toBe(3);
                expect(d3.roll()).toBe(1);
            });
        });

        describe("when die has 6 sides", function () {
            it("should roll each side successively and rollover to 1", function () {
                var d6 = diceTest.createDieThatRollsEachSideSuccessively(6);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(2);
                expect(d6.roll()).toBe(3);
                expect(d6.roll()).toBe(4);
                expect(d6.roll()).toBe(5);
                expect(d6.roll()).toBe(6);
                expect(d6.roll()).toBe(1);
            });
        });
    });
});

