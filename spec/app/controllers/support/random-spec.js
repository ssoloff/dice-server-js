/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
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
