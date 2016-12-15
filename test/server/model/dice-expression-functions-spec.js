/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const diceExpressionFunctions = require('../../../src/server/model/dice-expression-functions')
const diceTest = require('./test-support/dice-test')

describe('diceExpressionFunctions', () => {
  describe('.ceil', () => {
    describe('when value is negative', () => {
      it('should round up', () => {
        expect(diceExpressionFunctions.ceil(-1.75)).toBe(-1.0)
        expect(diceExpressionFunctions.ceil(-1.5)).toBe(-1.0)
        expect(diceExpressionFunctions.ceil(-1.25)).toBe(-1.0)
        expect(diceExpressionFunctions.ceil(-1.0)).toBe(-1.0)
      })
    })

    describe('when value is positive', () => {
      it('should round up', () => {
        expect(diceExpressionFunctions.ceil(1.0)).toBe(1.0)
        expect(diceExpressionFunctions.ceil(1.25)).toBe(2.0)
        expect(diceExpressionFunctions.ceil(1.5)).toBe(2.0)
        expect(diceExpressionFunctions.ceil(1.75)).toBe(2.0)
      })
    })
  })

  describe('.cloneHighestRolls', () => {
    describe('when rolls is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneHighestRolls(undefined, 1)
        }).toThrow()
      })
    })

    describe('when count is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneHighestRolls([], '3')
        }).toThrow()
      })
    })

    describe('when count less than zero', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneHighestRolls([], -1)
        }).toThrow()
      })
    })

    describe('when count equals zero', () => {
      it('should return the collection unmodified', () => {
        expect(diceExpressionFunctions.cloneHighestRolls([], 0)).toEqual([])
        expect(diceExpressionFunctions.cloneHighestRolls([1], 0)).toEqual([1])
        expect(diceExpressionFunctions.cloneHighestRolls([1, 2], 0)).toEqual([1, 2])
      })
    })

    describe('when count equals one', () => {
      it('should return the collection with the highest roll appended', () => {
        expect(diceExpressionFunctions.cloneHighestRolls([], 1)).toEqual([])
        expect(diceExpressionFunctions.cloneHighestRolls([1], 1)).toEqual([1, 1])
        expect(diceExpressionFunctions.cloneHighestRolls([1, 2], 1)).toEqual([1, 2, 2])
        expect(diceExpressionFunctions.cloneHighestRolls([2, 1, 3], 1)).toEqual([2, 1, 3, 3])
      })
    })

    describe('when count equals two', () => {
      it('should return the collection with the highest two rolls appended', () => {
        expect(diceExpressionFunctions.cloneHighestRolls([], 2)).toEqual([])
        expect(diceExpressionFunctions.cloneHighestRolls([1], 2)).toEqual([1, 1])
        expect(diceExpressionFunctions.cloneHighestRolls([1, 2], 2)).toEqual([1, 2, 2, 1])
        expect(diceExpressionFunctions.cloneHighestRolls([2, 1, 3], 2)).toEqual([2, 1, 3, 3, 2])
        expect(diceExpressionFunctions.cloneHighestRolls([4, 2, 1, 3], 2)).toEqual([4, 2, 1, 3, 4, 3])
      })
    })

    describe('when rolls contains duplicates', () => {
      it('should return the collection with the highest rolls appended', () => {
        expect(diceExpressionFunctions.cloneHighestRolls([1, 1], 2)).toEqual([1, 1, 1, 1])
        expect(diceExpressionFunctions.cloneHighestRolls([3, 2, 1, 3], 2)).toEqual([3, 2, 1, 3, 3, 3])
      })
    })
  })

  describe('.cloneLowestRolls', () => {
    describe('when rolls is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneLowestRolls(undefined, 1)
        }).toThrow()
      })
    })

    describe('when count is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneLowestRolls([], '3')
        }).toThrow()
      })
    })

    describe('when count less than zero', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.cloneLowestRolls([], -1)
        }).toThrow()
      })
    })

    describe('when count equals zero', () => {
      it('should return the collection unmodified', () => {
        expect(diceExpressionFunctions.cloneLowestRolls([], 0)).toEqual([])
        expect(diceExpressionFunctions.cloneLowestRolls([1], 0)).toEqual([1])
        expect(diceExpressionFunctions.cloneLowestRolls([1, 2], 0)).toEqual([1, 2])
      })
    })

    describe('when count equals one', () => {
      it('should return the collection with the lowest roll appended', () => {
        expect(diceExpressionFunctions.cloneLowestRolls([], 1)).toEqual([])
        expect(diceExpressionFunctions.cloneLowestRolls([1], 1)).toEqual([1, 1])
        expect(diceExpressionFunctions.cloneLowestRolls([1, 2], 1)).toEqual([1, 2, 1])
        expect(diceExpressionFunctions.cloneLowestRolls([2, 1, 3], 1)).toEqual([2, 1, 3, 1])
      })
    })

    describe('when count equals two', () => {
      it('should return the collection with the lowest two rolls appended', () => {
        expect(diceExpressionFunctions.cloneLowestRolls([], 2)).toEqual([])
        expect(diceExpressionFunctions.cloneLowestRolls([1], 2)).toEqual([1, 1])
        expect(diceExpressionFunctions.cloneLowestRolls([1, 2], 2)).toEqual([1, 2, 1, 2])
        expect(diceExpressionFunctions.cloneLowestRolls([2, 1, 3], 2)).toEqual([2, 1, 3, 1, 2])
        expect(diceExpressionFunctions.cloneLowestRolls([4, 2, 1, 3], 2)).toEqual([4, 2, 1, 3, 1, 2])
      })
    })

    describe('when rolls contains duplicates', () => {
      it('should return the collection with the lowest rolls appended', () => {
        expect(diceExpressionFunctions.cloneLowestRolls([1, 1], 2)).toEqual([1, 1, 1, 1])
        expect(diceExpressionFunctions.cloneLowestRolls([1, 2, 3, 1], 2)).toEqual([1, 2, 3, 1, 1, 1])
      })
    })
  })

  describe('.dropHighestRolls', () => {
    describe('when rolls is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropHighestRolls(undefined, 1)
        }).toThrow()
      })
    })

    describe('when count is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropHighestRolls([], '3')
        }).toThrow()
      })
    })

    describe('when count less than zero', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropHighestRolls([], -1)
        }).toThrow()
      })
    })

    describe('when count equals zero', () => {
      it('should return the collection unmodified', () => {
        expect(diceExpressionFunctions.dropHighestRolls([], 0)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([1], 0)).toEqual([1])
        expect(diceExpressionFunctions.dropHighestRolls([1, 2], 0)).toEqual([1, 2])
      })
    })

    describe('when count equals one', () => {
      it('should return the collection without the highest roll', () => {
        expect(diceExpressionFunctions.dropHighestRolls([], 1)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([1], 1)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([1, 2], 1)).toEqual([1])
        expect(diceExpressionFunctions.dropHighestRolls([2, 1, 3], 1)).toEqual([2, 1])
      })
    })

    describe('when count equals two', () => {
      it('should return the collection without the highest two rolls', () => {
        expect(diceExpressionFunctions.dropHighestRolls([], 2)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([1], 2)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([1, 2], 2)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([2, 1, 3], 2)).toEqual([1])
        expect(diceExpressionFunctions.dropHighestRolls([4, 2, 1, 3], 2)).toEqual([2, 1])
      })
    })

    describe('when rolls contains duplicates', () => {
      it('should return the collection without the earliest occurrences of the highest rolls', () => {
        expect(diceExpressionFunctions.dropHighestRolls([1, 1], 2)).toEqual([])
        expect(diceExpressionFunctions.dropHighestRolls([3, 3, 1, 3], 2)).toEqual([1, 3])
        expect(diceExpressionFunctions.dropHighestRolls([1, 2, 2], 2)).toEqual([1])
        expect(diceExpressionFunctions.dropHighestRolls([2, 3, 1, 2], 2)).toEqual([1, 2])
      })
    })
  })

  describe('.dropLowestRolls', () => {
    describe('when rolls is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropLowestRolls(undefined, 1)
        }).toThrow()
      })
    })

    describe('when count is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropLowestRolls([], '3')
        }).toThrow()
      })
    })

    describe('when count less than zero', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.dropLowestRolls([], -1)
        }).toThrow()
      })
    })

    describe('when count equals zero', () => {
      it('should return the collection unmodified', () => {
        expect(diceExpressionFunctions.dropLowestRolls([], 0)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1], 0)).toEqual([1])
        expect(diceExpressionFunctions.dropLowestRolls([1, 2], 0)).toEqual([1, 2])
      })
    })

    describe('when count equals one', () => {
      it('should return the collection without the lowest roll', () => {
        expect(diceExpressionFunctions.dropLowestRolls([], 1)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1], 1)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1, 2], 1)).toEqual([2])
        expect(diceExpressionFunctions.dropLowestRolls([2, 1, 3], 1)).toEqual([2, 3])
      })
    })

    describe('when count equals two', () => {
      it('should return the collection without the lowest two rolls', () => {
        expect(diceExpressionFunctions.dropLowestRolls([], 2)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1], 2)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1, 2], 2)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([2, 1, 3], 2)).toEqual([3])
        expect(diceExpressionFunctions.dropLowestRolls([4, 2, 1, 3], 2)).toEqual([4, 3])
      })
    })

    describe('when rolls contains duplicates', () => {
      it('should return the collection without the earliest occurrences of the lowest rolls', () => {
        expect(diceExpressionFunctions.dropLowestRolls([1, 1], 2)).toEqual([])
        expect(diceExpressionFunctions.dropLowestRolls([1, 1, 3, 1], 2)).toEqual([3, 1])
        expect(diceExpressionFunctions.dropLowestRolls([2, 1, 1], 2)).toEqual([2])
        expect(diceExpressionFunctions.dropLowestRolls([2, 1, 3, 2], 2)).toEqual([3, 2])
      })
    })
  })

  describe('.floor', () => {
    describe('when value is negative', () => {
      it('should round down', () => {
        expect(diceExpressionFunctions.floor(-1.75)).toBe(-2.0)
        expect(diceExpressionFunctions.floor(-1.5)).toBe(-2.0)
        expect(diceExpressionFunctions.floor(-1.25)).toBe(-2.0)
        expect(diceExpressionFunctions.floor(-1.0)).toBe(-1.0)
      })
    })

    describe('when value is positive', () => {
      it('should round down', () => {
        expect(diceExpressionFunctions.floor(1.0)).toBe(1.0)
        expect(diceExpressionFunctions.floor(1.25)).toBe(1.0)
        expect(diceExpressionFunctions.floor(1.5)).toBe(1.0)
        expect(diceExpressionFunctions.floor(1.75)).toBe(1.0)
      })
    })
  })

  describe('.roll', () => {
    let d3

    beforeEach(() => {
      d3 = diceTest.createDieThatRollsEachSideSuccessively(3)
    })

    describe('when count is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.roll(undefined, d3)
        }).toThrow()
        expect(() => {
          diceExpressionFunctions.roll('3', d3)
        }).toThrow()
      })
    })

    describe('when count less than one', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.roll(0, d3)
        }).toThrowError(RangeError)
        expect(() => {
          diceExpressionFunctions.roll(Number.MIN_SAFE_INTEGER, d3)
        }).toThrowError(RangeError)
      })
    })

    describe('when die is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.roll(3, undefined)
        }).toThrow()
      })
    })

    it('should return collection of individual rolls', () => {
      expect(diceExpressionFunctions.roll(1, d3)).toEqual([1])
      expect(diceExpressionFunctions.roll(2, d3)).toEqual([2, 3])
      expect(diceExpressionFunctions.roll(3, d3)).toEqual([1, 2, 3])
    })
  })

  describe('.round', () => {
    describe('when value is negative', () => {
      it('should round to nearest', () => {
        expect(diceExpressionFunctions.round(-1.75)).toBe(-2.0)
        expect(diceExpressionFunctions.round(-1.5)).toBe(-1.0)
        expect(diceExpressionFunctions.round(-1.25)).toBe(-1.0)
        expect(diceExpressionFunctions.round(-1.0)).toBe(-1.0)
      })
    })

    describe('when value is positive', () => {
      it('should round to nearest', () => {
        expect(diceExpressionFunctions.round(1.0)).toBe(1.0)
        expect(diceExpressionFunctions.round(1.25)).toBe(1.0)
        expect(diceExpressionFunctions.round(1.5)).toBe(2.0)
        expect(diceExpressionFunctions.round(1.75)).toBe(2.0)
      })
    })
  })

  describe('.sum', () => {
    describe('when rolls has less than one element', () => {
      it('should throw exception', () => {
        expect(() => {
          diceExpressionFunctions.sum(undefined)
        }).toThrow()
        expect(() => {
          diceExpressionFunctions.sum([])
        }).toThrow()
      })
    })

    it('should return sum of rolls', () => {
      expect(diceExpressionFunctions.sum([1])).toBe(1)
      expect(diceExpressionFunctions.sum([1, 2])).toBe(3)
      expect(diceExpressionFunctions.sum([1, 2, 3])).toBe(6)
    })
  })

  describe('.trunc', () => {
    describe('when value is negative', () => {
      it('should round towards zero', () => {
        expect(diceExpressionFunctions.trunc(-1.75)).toBe(-1.0)
        expect(diceExpressionFunctions.trunc(-1.5)).toBe(-1.0)
        expect(diceExpressionFunctions.trunc(-1.25)).toBe(-1.0)
        expect(diceExpressionFunctions.trunc(-1.0)).toBe(-1.0)
      })
    })

    describe('when value is positive', () => {
      it('should round towards zero', () => {
        expect(diceExpressionFunctions.trunc(1.0)).toBe(1.0)
        expect(diceExpressionFunctions.trunc(1.25)).toBe(1.0)
        expect(diceExpressionFunctions.trunc(1.5)).toBe(1.0)
        expect(diceExpressionFunctions.trunc(1.75)).toBe(1.0)
      })
    })
  })
})
