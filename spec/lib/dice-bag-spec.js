/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var dice = require('../../src/lib/dice');

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
