/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const dice = require('../../../src/server/model/dice')

describe('diceExpressionFormatter', () => {
  let three,
    four

  beforeEach(() => {
    three = dice.expression.forConstant(3)
    four = dice.expression.forConstant(4)
  })

  describe('.format', () => {
    describe('when expression is an addition expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forAddition(three, four)
        expect(dice.expressionFormatter.format(expression)).toBe('3 + 4')
      })
    })

    describe('when expression is an array expression', () => {
      describe('when array contains one element', () => {
        it('should return formatted expression', () => {
          const expression = dice.expression.forArray([three])
          expect(dice.expressionFormatter.format(expression)).toBe('[3]')
        })
      })

      describe('when array contains two elements', () => {
        it('should return formatted expression', () => {
          const expression = dice.expression.forArray([three, four])
          expect(dice.expressionFormatter.format(expression)).toBe('[3, 4]')
        })
      })
    })

    describe('when expression is a constant expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forConstant(42)
        expect(dice.expressionFormatter.format(expression)).toBe('42')
      })
    })

    describe('when expression is a die expression', () => {
      it('should return formatted expression', () => {
        const d3 = dice.bag.create().d(3)
        const expression = dice.expression.forDie(d3)
        expect(dice.expressionFormatter.format(expression)).toBe('d3')
      })
    })

    describe('when expression is a division expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forDivision(three, four)
        expect(dice.expressionFormatter.format(expression)).toBe('3 / 4')
      })
    })

    describe('when expression is a function call expression', () => {
      describe('when zero arguments specified', () => {
        it('should return formatted expression', () => {
          const expression = dice.expression.forFunctionCall('max', Math.max, [])
          expect(dice.expressionFormatter.format(expression)).toBe('max()')
        })
      })

      describe('when one argument specified', () => {
        it('should return formatted expression', () => {
          const expression = dice.expression.forFunctionCall('max', Math.max, [three])
          expect(dice.expressionFormatter.format(expression)).toBe('max(3)')
        })
      })

      describe('when two arguments specified', () => {
        it('should return formatted expression', () => {
          const expression = dice.expression.forFunctionCall('max', Math.max, [three, four])
          expect(dice.expressionFormatter.format(expression)).toBe('max(3, 4)')
        })
      })
    })

    describe('when expression is a group expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forGroup(three)
        expect(dice.expressionFormatter.format(expression)).toBe('(3)')
      })
    })

    describe('when expression is a modulo expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forModulo(four, three)
        expect(dice.expressionFormatter.format(expression)).toBe('4 % 3')
      })
    })

    describe('when expression is a multiplication expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forMultiplication(three, four)
        expect(dice.expressionFormatter.format(expression)).toBe('3 * 4')
      })
    })

    describe('when expression is a negative expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forNegative(three)
        expect(dice.expressionFormatter.format(expression)).toBe('-3')
      })
    })

    describe('when expression is a positive expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forPositive(three)
        expect(dice.expressionFormatter.format(expression)).toBe('+3')
      })
    })

    describe('when expression is a subtraction expression', () => {
      it('should return formatted expression', () => {
        const expression = dice.expression.forSubtraction(three, four)
        expect(dice.expressionFormatter.format(expression)).toBe('3 - 4')
      })
    })

    describe('when expression is of an unknown type', () => {
      it('should throw an exception', () => {
        expect(() => {
          dice.expressionFormatter.format({
            typeId: '__unknown__'
          })
        }).toThrow()
      })
    })
  })
})
