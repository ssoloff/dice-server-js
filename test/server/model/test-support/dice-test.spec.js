/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const diceTest = require('./dice-test')

describe('diceTest', () => {
  describe('.createBagThatProvidesDiceThatAlwaysRollOne', () => {
    let bag

    beforeEach(() => {
      bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne()
    })

    describe('when die has 3 sides', () => {
      it('should always roll 1', () => {
        const d3 = bag.d(3)
        expect(d3.roll()).toBe(1)
        expect(d3.roll()).toBe(1)
        expect(d3.roll()).toBe(1)
      })
    })

    describe('when die has 6 sides', () => {
      it('should always roll 1', () => {
        const d6 = bag.d(6)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(1)
      })
    })
  })

  describe('.createDieThatRollsEachSideSuccessively', () => {
    describe('when die has 3 sides', () => {
      it('should roll each side successively and rollover to 1', () => {
        const d3 = diceTest.createDieThatRollsEachSideSuccessively(3)
        expect(d3.roll()).toBe(1)
        expect(d3.roll()).toBe(2)
        expect(d3.roll()).toBe(3)
        expect(d3.roll()).toBe(1)
      })
    })

    describe('when die has 6 sides', () => {
      it('should roll each side successively and rollover to 1', () => {
        const d6 = diceTest.createDieThatRollsEachSideSuccessively(6)
        expect(d6.roll()).toBe(1)
        expect(d6.roll()).toBe(2)
        expect(d6.roll()).toBe(3)
        expect(d6.roll()).toBe(4)
        expect(d6.roll()).toBe(5)
        expect(d6.roll()).toBe(6)
        expect(d6.roll()).toBe(1)
      })
    })
  })
})
