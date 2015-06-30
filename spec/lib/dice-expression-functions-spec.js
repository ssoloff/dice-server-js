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

var diceExpressionFunctions = require("../../lib/dice-expression-functions");

describe("diceExpressionFunctions", function () {
    describe(".ceil", function () {
        describe("when value is negative", function () {
            it("should round up", function () {
                expect(diceExpressionFunctions.ceil(-1.75)).toBe(-1.0);
                expect(diceExpressionFunctions.ceil(-1.5)).toBe(-1.0);
                expect(diceExpressionFunctions.ceil(-1.25)).toBe(-1.0);
                expect(diceExpressionFunctions.ceil(-1.0)).toBe(-1.0);
            });
        });

        describe("when value is positive", function () {
            it("should round up", function () {
                expect(diceExpressionFunctions.ceil(1.0)).toBe(1.0);
                expect(diceExpressionFunctions.ceil(1.25)).toBe(2.0);
                expect(diceExpressionFunctions.ceil(1.5)).toBe(2.0);
                expect(diceExpressionFunctions.ceil(1.75)).toBe(2.0);
            });
        });
    });

    describe(".floor", function () {
        describe("when value is negative", function () {
            it("should round down", function () {
                expect(diceExpressionFunctions.floor(-1.75)).toBe(-2.0);
                expect(diceExpressionFunctions.floor(-1.5)).toBe(-2.0);
                expect(diceExpressionFunctions.floor(-1.25)).toBe(-2.0);
                expect(diceExpressionFunctions.floor(-1.0)).toBe(-1.0);
            });
        });

        describe("when value is positive", function () {
            it("should round down", function () {
                expect(diceExpressionFunctions.floor(1.0)).toBe(1.0);
                expect(diceExpressionFunctions.floor(1.25)).toBe(1.0);
                expect(diceExpressionFunctions.floor(1.5)).toBe(1.0);
                expect(diceExpressionFunctions.floor(1.75)).toBe(1.0);
            });
        });
    });

    describe(".round", function () {
        describe("when value is negative", function () {
            it("should round to nearest", function () {
                expect(diceExpressionFunctions.round(-1.75)).toBe(-2.0);
                expect(diceExpressionFunctions.round(-1.5)).toBe(-1.0);
                expect(diceExpressionFunctions.round(-1.25)).toBe(-1.0);
                expect(diceExpressionFunctions.round(-1.0)).toBe(-1.0);
            });
        });

        describe("when value is positive", function () {
            it("should round to nearest", function () {
                expect(diceExpressionFunctions.round(1.0)).toBe(1.0);
                expect(diceExpressionFunctions.round(1.25)).toBe(1.0);
                expect(diceExpressionFunctions.round(1.5)).toBe(2.0);
                expect(diceExpressionFunctions.round(1.75)).toBe(2.0);
            });
        });
    });

    describe(".trunc", function () {
        describe("when value is negative", function () {
            it("should round towards zero", function () {
                expect(diceExpressionFunctions.trunc(-1.75)).toBe(-1.0);
                expect(diceExpressionFunctions.trunc(-1.5)).toBe(-1.0);
                expect(diceExpressionFunctions.trunc(-1.25)).toBe(-1.0);
                expect(diceExpressionFunctions.trunc(-1.0)).toBe(-1.0);
            });
        });

        describe("when value is positive", function () {
            it("should round towards zero", function () {
                expect(diceExpressionFunctions.trunc(1.0)).toBe(1.0);
                expect(diceExpressionFunctions.trunc(1.25)).toBe(1.0);
                expect(diceExpressionFunctions.trunc(1.5)).toBe(1.0);
                expect(diceExpressionFunctions.trunc(1.75)).toBe(1.0);
            });
        });
    });
});

