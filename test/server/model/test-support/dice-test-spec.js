/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const diceTest = require('./dice-test');

describe('diceTest', function () {
    describe('.createBagThatProvidesDiceThatAlwaysRollOne', function () {
        let bag;

        beforeEach(function () {
            bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne();
        });

        describe('when die has 3 sides', function () {
            it('should always roll 1', function () {
                const d3 = bag.d(3);
                expect(d3.roll()).toBe(1);
                expect(d3.roll()).toBe(1);
                expect(d3.roll()).toBe(1);
            });
        });

        describe('when die has 6 sides', function () {
            it('should always roll 1', function () {
                const d6 = bag.d(6);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(1);
                expect(d6.roll()).toBe(1);
            });
        });
    });

    describe('.createDieThatRollsEachSideSuccessively', function () {
        describe('when die has 3 sides', function () {
            it('should roll each side successively and rollover to 1', function () {
                const d3 = diceTest.createDieThatRollsEachSideSuccessively(3);
                expect(d3.roll()).toBe(1);
                expect(d3.roll()).toBe(2);
                expect(d3.roll()).toBe(3);
                expect(d3.roll()).toBe(1);
            });
        });

        describe('when die has 6 sides', function () {
            it('should roll each side successively and rollover to 1', function () {
                const d6 = diceTest.createDieThatRollsEachSideSuccessively(6);
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
