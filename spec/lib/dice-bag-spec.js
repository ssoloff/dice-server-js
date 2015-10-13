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

'use strict';

var dice = require('../../lib/dice');

describe('diceBag', function () {
    var bag;

    beforeEach(function () {
        var randomNumberGenerator = jasmine.createSpy('randomNumberGenerator');
        bag = dice.bag.create(randomNumberGenerator);
    });

    it('should use a default random number generator', function () {
        expect(function () {
            var bag = dice.bag.create();
            bag.d(6).roll();
        }).not.toThrow();
    });

    describe('#d', function () {
        var d6;

        beforeEach(function () {
            d6 = bag.d(6);
        });

        describe('when sides not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    bag.d(undefined);
                }).toThrow();
                expect(function () {
                    bag.d('3');
                }).toThrow();
            });
        });

        describe('when sides less than one', function () {
            it('should throw exception', function () {
                expect(function () {
                    bag.d(0);
                }).toThrowError(RangeError);
                expect(function () {
                    bag.d(Number.MIN_SAFE_INTEGER);
                }).toThrowError(RangeError);
            });
        });

        describe('.roll', function () {
            it('should return 1 when random number is 1', function () {
                bag.randomNumberGenerator.and.returnValue(1);
                expect(d6.roll()).toBe(1);
            });

            it('should return <sides> when random number is <sides>', function () {
                bag.randomNumberGenerator.and.returnValue(d6.sides);
                expect(d6.roll()).toBe(d6.sides);
            });
        });

        describe('.sides', function () {
            it('should return the die sides', function () {
                expect(d6.sides).toBe(6);
            });
        });
    });
});

