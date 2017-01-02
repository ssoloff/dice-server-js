/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dice = require('../../../src/server/model/dice')

describe('diceBag', () => {
  let bag

  beforeEach(() => {
    const randomNumberGenerator = jasmine.createSpy('randomNumberGenerator')
    bag = dice.bag.create(randomNumberGenerator)
  })

  it('should use a default random number generator', () => {
    expect(() => {
      const bag = dice.bag.create()
      bag.d(6).roll()
    }).not.toThrow()
  })

  describe('#d', () => {
    let d6

    beforeEach(() => {
      d6 = bag.d(6)
    })

    describe('when sides not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          bag.d(undefined)
        }).toThrow()
        expect(() => {
          bag.d('3')
        }).toThrow()
      })
    })

    describe('when sides less than one', () => {
      it('should throw exception', () => {
        expect(() => {
          bag.d(0)
        }).toThrowError(RangeError)
        expect(() => {
          bag.d(Number.MIN_SAFE_INTEGER)
        }).toThrowError(RangeError)
      })
    })

    describe('.roll', () => {
      it('should return 1 when random number is 1', () => {
        bag.randomNumberGenerator.and.returnValue(1)
        expect(d6.roll()).toBe(1)
      })

      it('should return <sides> when random number is <sides>', () => {
        bag.randomNumberGenerator.and.returnValue(d6.sides)
        expect(d6.roll()).toBe(d6.sides)
      })
    })

    describe('.sides', () => {
      it('should return the die sides', () => {
        expect(d6.sides).toBe(6)
      })
    })
  })
})
