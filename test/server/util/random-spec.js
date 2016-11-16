/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const random = require('../../../src/server/util/random');

describe('random', () => {
  const SIDES = 0xFFFFFFFF;

  describe('.uniform', () => {
    describe('when options not provided', () => {
      it('should use auto seed', () => {
        const randomNumberGenerator = random.uniform();

        const randomValue = randomNumberGenerator(SIDES);

        expect(randomValue).toBeGreaterThan(0);
        expect(randomValue).toBeLessThan(SIDES + 1);
      });
    });

    describe('when seed not provided', () => {
      it('should use auto seed', () => {
        const randomNumberGenerator = random.uniform({});

        const randomValue = randomNumberGenerator(SIDES);

        expect(randomValue).toBeGreaterThan(0);
        expect(randomValue).toBeLessThan(SIDES + 1);
      });
    });

    describe('when number seed provided', () => {
      it('should use provided seed', () => {
        const randomNumberGenerator1 = random.uniform({seed: 42});
        const randomNumberGenerator2 = random.uniform({seed: 42});

        const randomValue1 = randomNumberGenerator1(SIDES);
        const randomValue2 = randomNumberGenerator2(SIDES);

        expect(randomValue1).toBe(randomValue2);
      });
    });

    describe('when array seed provided', () => {
      it('should use provided seed', () => {
        const randomNumberGenerator1 = random.uniform({seed: [42, 2112]});
        const randomNumberGenerator2 = random.uniform({seed: [42, 2112]});

        const randomValue1 = randomNumberGenerator1(SIDES);
        const randomValue2 = randomNumberGenerator2(SIDES);

        expect(randomValue1).toBe(randomValue2);
      });
    });
  });
});
