/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const _ = require('underscore');
const dice = require('../../../src/server/model/dice');
const diceTest = require('./test-support/dice-test');

describe('diceExpression', () => {
  let three;
  let four;

  beforeEach(() => {
    jasmine.addCustomEqualityTester(diceTest.isDiceExpressionResultEqual);
    three = dice.expression.forConstant(3);
    four = dice.expression.forConstant(4);
  });

  describe('.forAddition', () => {
    describe('when augend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forAddition(undefined, three);
        }).toThrow();
      });
    });

    describe('when addend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forAddition(four, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to sum of augend and addend', () => {
        const expression = dice.expression.forAddition(four, three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forAddition(
            dice.expressionResult.forConstant(four.constant),
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });

      it('should evaluate subexpressions', () => {
        const expression = dice.expression.forAddition(dice.expression.forAddition(four, three), three);
        expect(expression.evaluate().value).toBe(10);
      });
    });
  });

  describe('.forArray', () => {
    describe('when expressions is not an array', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forArray(undefined);
        }).toThrow();
        expect(() => {
          dice.expression.forArray('3');
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to array of expression result values', () => {
        const expression = dice.expression.forArray([three, four]);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forArray([
            dice.expressionResult.forConstant(three.constant),
            dice.expressionResult.forConstant(four.constant),
          ])
        );
      });
    });
  });

  describe('.forConstant', () => {
    describe('when constant is not a number', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forConstant(undefined);
        }).toThrow();
        expect(() => {
          dice.expression.forConstant('3');
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to constant', () => {
        const constant = 5;
        const expression = dice.expression.forConstant(constant);
        expect(expression.evaluate()).toEqual(dice.expressionResult.forConstant(constant));
      });
    });
  });

  describe('.forDie', () => {
    describe('when die is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forDie(undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to die', () => {
        const d3 = dice.bag.create().d(3);
        const expression = dice.expression.forDie(d3);
        expect(expression.evaluate()).toEqual(dice.expressionResult.forDie(d3));
      });
    });
  });

  describe('.forDivision', () => {
    describe('when dividend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forDivision(undefined, three);
        }).toThrow();
      });
    });

    describe('when divisor expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forDivision(four, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to quotient of dividend and divisor', () => {
        const expression = dice.expression.forDivision(three, four);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forDivision(
            dice.expressionResult.forConstant(three.constant),
            dice.expressionResult.forConstant(four.constant)
          )
        );
      });

      it('should evaluate subexpressions', () => {
        const expression = dice.expression.forDivision(dice.expression.forDivision(three, four), four);
        expect(expression.evaluate().value).toBe(0.1875);
      });
    });
  });

  describe('.forFunctionCall', () => {
    function f() {
      return 42 + _.toArray(arguments).reduce((first, second) => first + second, 0);
    }

    describe('when function name is not a string', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forFunctionCall(undefined, f, []);
        }).toThrow();
        expect(() => {
          dice.expression.forFunctionCall(1, f, []);
        }).toThrow();
      });
    });

    describe('when function is not a function', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forFunctionCall('f', undefined, []);
        }).toThrow();
        expect(() => {
          dice.expression.forFunctionCall('f', 'return 1;', []);
        }).toThrow();
      });
    });

    describe('when function argument list expressions is not an array', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forFunctionCall('f', f, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      describe('when zero arguments specified', () => {
        it('should return result with value equal to function return value', () => {
          const expression = dice.expression.forFunctionCall('f', f, []);
          expect(expression.evaluate()).toEqual(
            dice.expressionResult.forFunctionCall(
              42,
              'f',
              []
            )
          );
        });
      });

      describe('when one argument specified', () => {
        it('should return result with value equal to function return value', () => {
          const expression = dice.expression.forFunctionCall('f', f, [three]);
          expect(expression.evaluate()).toEqual(
            dice.expressionResult.forFunctionCall(
              45,
              'f',
              [
                dice.expressionResult.forConstant(three.constant),
              ]
            )
          );
        });
      });

      describe('when two arguments specified', () => {
        it('should return result with value equal to function return value', () => {
          const expression = dice.expression.forFunctionCall('f', f, [three, four]);
          expect(expression.evaluate()).toEqual(
            dice.expressionResult.forFunctionCall(
              49,
              'f',
              [
                dice.expressionResult.forConstant(three.constant),
                dice.expressionResult.forConstant(four.constant),
              ]
            )
          );
        });
      });
    });
  });

  describe('.forGroup', () => {
    describe('when child expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forGroup(undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to child expression result value', () => {
        const expression = dice.expression.forGroup(three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forGroup(
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });
    });
  });

  describe('.forModulo', () => {
    describe('when dividend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forModulo(undefined, three);
        }).toThrow();
      });
    });

    describe('when divisor expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forModulo(four, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to remainder of division of dividend and divisor', () => {
        const expression = dice.expression.forModulo(four, three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forModulo(
            dice.expressionResult.forConstant(four.constant),
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });

      it('should evaluate subexpressions', () => {
        const expression = dice.expression.forModulo(dice.expression.forModulo(three, four), three);
        expect(expression.evaluate().value).toBe(0);
      });
    });
  });

  describe('.forMultiplication', () => {
    describe('when multiplicand expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forMultiplication(undefined, three);
        }).toThrow();
      });
    });

    describe('when multiplier expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forMultiplication(four, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to product of multiplicand and multiplier', () => {
        const expression = dice.expression.forMultiplication(four, three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forMultiplication(
            dice.expressionResult.forConstant(four.constant),
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });

      it('should evaluate subexpressions', () => {
        const expression = dice.expression.forMultiplication(dice.expression.forMultiplication(four, three), three);
        expect(expression.evaluate().value).toBe(36);
      });
    });
  });

  describe('.forNegative', () => {
    describe('when child expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forNegative(undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to negative of child expression result value', () => {
        const expression = dice.expression.forNegative(three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forNegative(
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });
    });
  });

  describe('.forPositive', () => {
    describe('when child expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forPositive(undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to child expression result value', () => {
        const expression = dice.expression.forPositive(three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forPositive(
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });
    });
  });

  describe('.forSubtraction', () => {
    describe('when minuend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forSubtraction(undefined, three);
        }).toThrow();
      });
    });

    describe('when subtrahend expression is falsy', () => {
      it('should throw exception', () => {
        expect(() => {
          dice.expression.forSubtraction(four, undefined);
        }).toThrow();
      });
    });

    describe('.evaluate', () => {
      it('should return result with value equal to difference between minuend and subtrahend', () => {
        const expression = dice.expression.forSubtraction(four, three);
        expect(expression.evaluate()).toEqual(
          dice.expressionResult.forSubtraction(
            dice.expressionResult.forConstant(four.constant),
            dice.expressionResult.forConstant(three.constant)
          )
        );
      });

      it('should evaluate subexpressions', () => {
        const expression = dice.expression.forSubtraction(dice.expression.forSubtraction(four, three), three);
        expect(expression.evaluate().value).toBe(-2);
      });
    });
  });
});
