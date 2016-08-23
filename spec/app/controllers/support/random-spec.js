/*
 * Copyright (c) 2016 Steven Soloff
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

var random = require('../../../../app/controllers/support/random');

describe('random', function () {
    var SIDES = 0xFFFFFFFF;

    describe('.uniform', function () {
        describe('when options not provided', function () {
            it('should use auto seed', function () {
                var randomNumberGenerator,
                    randomValue;

                randomNumberGenerator = random.uniform();

                randomValue = randomNumberGenerator(SIDES);

                expect(randomValue).toBeGreaterThan(0);
                expect(randomValue).toBeLessThan(SIDES + 1);
            });
        });

        describe('when seed not provided', function () {
            it('should use auto seed', function () {
                var randomNumberGenerator,
                    randomValue;

                randomNumberGenerator = random.uniform({});

                randomValue = randomNumberGenerator(SIDES);

                expect(randomValue).toBeGreaterThan(0);
                expect(randomValue).toBeLessThan(SIDES + 1);
            });
        });

        describe('when number seed provided', function () {
            it('should use provided seed', function () {
                var randomNumberGenerator1,
                    randomNumberGenerator2,
                    randomValue1,
                    randomValue2;

                randomNumberGenerator1 = random.uniform({seed: 42});
                randomNumberGenerator2 = random.uniform({seed: 42});

                randomValue1 = randomNumberGenerator1(SIDES);
                randomValue2 = randomNumberGenerator2(SIDES);

                expect(randomValue1).toBe(randomValue2);
            });
        });

        describe('when array seed provided', function () {
            it('should use provided seed', function () {
                var randomNumberGenerator1,
                    randomNumberGenerator2,
                    randomValue1,
                    randomValue2;

                randomNumberGenerator1 = random.uniform({seed: [42, 2112]});
                randomNumberGenerator2 = random.uniform({seed: [42, 2112]});

                randomValue1 = randomNumberGenerator1(SIDES);
                randomValue2 = randomNumberGenerator2(SIDES);

                expect(randomValue1).toBe(randomValue2);
            });
        });
    });
});
