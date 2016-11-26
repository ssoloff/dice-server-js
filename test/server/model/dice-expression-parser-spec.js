/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const dice = require('../../../src/server/model/dice');
const diceExpressionFunctions = require('../../../src/server/model/dice-expression-functions');
const diceTest = require('./test-support/dice-test');

describe('diceExpressionParser', () => {
  const f = Math.max;
  let expressionParser,
    expressionParserContext,
    one,
    two,
    three;

  beforeEach(() => {
    jasmine.addCustomEqualityTester(diceTest.isDiceExpressionEqual);
    expressionParserContext = dice.expressionParser.createDefaultContext();
    expressionParserContext.functions.f = f;
    expressionParser = dice.expressionParser.create(expressionParserContext);
    one = dice.expression.forConstant(1);
    two = dice.expression.forConstant(2);
    three = dice.expression.forConstant(3);
  });

  describe('.create', () => {
    it('should use a default context if one is not provided', () => {
      expressionParser = dice.expressionParser.create();
      expect(expressionParser.parse('trunc(3/2)').evaluate().value).toBe(1);
    });

    it('should use the dice bag in the context', () => {
      expressionParserContext.bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne();
      expect(expressionParser.parse('3d6').evaluate().value).toBe(3);
    });
  });

  describe('#parse', () => {
    describe('when source empty', () => {
      it('should throw exception', () => {
        expect(() => {
          expressionParser.parse('');
        }).toThrow();
      });
    });

    describe('literals', () => {
      it('should parse an integer literal', () => {
        expect(expressionParser.parse('2')).toEqual(two);
      });

      it('should parse an array literal', () => {
        expect(expressionParser.parse('[]')).toEqual(dice.expression.forArray([]));
        expect(expressionParser.parse('[1]')).toEqual(dice.expression.forArray([one]));
        expect(expressionParser.parse('[1, 2]')).toEqual(dice.expression.forArray([one, two]));
      });

      it('should parse a die literal', () => {
        expect(expressionParser.parse('d6')).toEqual(dice.expression.forDie(expressionParserContext.bag.d(6)));
      });

      it('should parse a percentile die literal', () => {
        expect(expressionParser.parse('d%')).toEqual(dice.expression.forDie(expressionParserContext.bag.d(100)));
      });

      it('should parse a dice roll literal', () => {
        expect(expressionParser.parse('3d6')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(3),
              dice.expression.forDie(expressionParserContext.bag.d(6)),
            ]),
          ])
        );
      });

      it('should parse a percentile dice roll literal', () => {
        expect(expressionParser.parse('2d%')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(2),
              dice.expression.forDie(expressionParserContext.bag.d(100)),
            ]),
          ])
        );
      });

      it('should parse a dice roll and clone highest literal', () => {
        expect(expressionParser.parse('4d6+H')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(1),
            ]),
          ])
        );
        expect(expressionParser.parse('4d6+2H')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(2),
            ]),
          ])
        );
      });

      it('should parse a dice roll and clone lowest literal', () => {
        expect(expressionParser.parse('4d6+L')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(1),
            ]),
          ])
        );
        expect(expressionParser.parse('4d6+2L')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(2),
            ]),
          ])
        );
      });

      it('should parse a dice roll and drop highest literal', () => {
        expect(expressionParser.parse('4d6-H')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(1),
            ]),
          ])
        );
        expect(expressionParser.parse('4d6-2H')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(2),
            ]),
          ])
        );
      });

      it('should parse a dice roll and drop lowest literal', () => {
        expect(expressionParser.parse('4d6-L')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(1),
            ]),
          ])
        );
        expect(expressionParser.parse('4d6-2L')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
              dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                dice.expression.forConstant(4),
                dice.expression.forDie(expressionParserContext.bag.d(6)),
              ]),
              dice.expression.forConstant(2),
            ]),
          ])
        );
      });
    });

    describe('arithmetic operators', () => {
      it('should parse the addition of two constants', () => {
        expect(expressionParser.parse('1 + 2')).toEqual(dice.expression.forAddition(one, two));
      });

      it('should parse the subtraction of two constants', () => {
        expect(expressionParser.parse('1 - 2')).toEqual(dice.expression.forSubtraction(one, two));
      });

      it('should parse the multiplication of two constants', () => {
        expect(expressionParser.parse('1 * 2')).toEqual(dice.expression.forMultiplication(one, two));
      });

      it('should parse the division of two constants', () => {
        expect(expressionParser.parse('1 / 2')).toEqual(dice.expression.forDivision(one, two));
      });

      it('should parse the modulo of two constants', () => {
        expect(expressionParser.parse('3 % 2')).toEqual(dice.expression.forModulo(three, two));
      });
    });

    describe('extended divide and round operators', () => {
      it('should parse divide and round towards zero', () => {
        expect(expressionParser.parse('1 // 2')).toEqual(
          dice.expression.forFunctionCall('trunc', diceExpressionFunctions.trunc, [
            dice.expression.forDivision(one, two),
          ])
        );
      });

      it('should parse divide and round to nearest', () => {
        expect(expressionParser.parse('1 /~ 2')).toEqual(
          dice.expression.forFunctionCall('round', diceExpressionFunctions.round, [
            dice.expression.forDivision(one, two),
          ])
        );
      });

      it('should parse divide and round up', () => {
        expect(expressionParser.parse('1 /+ 2')).toEqual(
          dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [
            dice.expression.forDivision(one, two),
          ])
        );
      });

      it('should parse divide and round down', () => {
        expect(expressionParser.parse('1 /- 2')).toEqual(
          dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [
            dice.expression.forDivision(one, two),
          ])
        );
      });
    });

    describe('unary operators', () => {
      it('should parse positive', () => {
        expect(expressionParser.parse('+1')).toEqual(dice.expression.forPositive(one));
      });

      it('should parse negative', () => {
        expect(expressionParser.parse('-1')).toEqual(dice.expression.forNegative(one));
      });
    });

    describe('operator precedence', () => {
      it('should give precedence to multiplication over addition', () => {
        expect(expressionParser.parse('3*1+1*3')).toEqual(
          dice.expression.forAddition(
            dice.expression.forMultiplication(three, one),
            dice.expression.forMultiplication(one, three)
          )
        );
      });

      it('should allow grouping to override operator precedence', () => {
        expect(expressionParser.parse('(3*1)+(1*3)')).toEqual(
          dice.expression.forAddition(
            dice.expression.forGroup(dice.expression.forMultiplication(three, one)),
            dice.expression.forGroup(dice.expression.forMultiplication(one, three))
          )
        );
        expect(expressionParser.parse('3*(1+1)*3')).toEqual(
          dice.expression.forMultiplication(
            dice.expression.forMultiplication(
              three,
              dice.expression.forGroup(dice.expression.forAddition(one, one))
            ),
            three
          )
        );
        expect(expressionParser.parse('3*((1+1)*3)')).toEqual(
          dice.expression.forMultiplication(
            three,
            dice.expression.forGroup(
              dice.expression.forMultiplication(
                dice.expression.forGroup(dice.expression.forAddition(one, one)),
                three
              )
            )
          )
        );
        expect(expressionParser.parse('(3*(1+1))*3')).toEqual(
          dice.expression.forMultiplication(
            dice.expression.forGroup(
              dice.expression.forMultiplication(
                three,
                dice.expression.forGroup(dice.expression.forAddition(one, one))
              )
            ),
            three
          )
        );
      });

      it('should give precedence to divide and round down operator over unary negative operator', () => {
        expect(expressionParser.parse('1/-2')).toEqual(
          dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [
            dice.expression.forDivision(one, two),
          ])
        );
        expect(expressionParser.parse('1/ -2')).toEqual(
          dice.expression.forDivision(one, dice.expression.forNegative(two))
        );
      });

      it('should give precedence to divide and round up operator over unary positive operator', () => {
        expect(expressionParser.parse('1/+2')).toEqual(
          dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [
            dice.expression.forDivision(one, two),
          ])
        );
        expect(expressionParser.parse('1/ +2')).toEqual(
          dice.expression.forDivision(one, dice.expression.forPositive(two))
        );
      });
    });

    describe('function calls', () => {
      describe('when function is unknown', () => {
        it('should throw exception', () => {
          expect(() => {
            expressionParser.parse('unknown()');
          }).toThrow();
        });
      });

      it('should parse a function call with zero arguments', () => {
        expect(expressionParser.parse('f()')).toEqual(dice.expression.forFunctionCall('f', f, []));
      });

      it('should parse a function call with one argument', () => {
        expect(expressionParser.parse('f(1)')).toEqual(dice.expression.forFunctionCall('f', f, [one]));
      });

      it('should parse a function call with two arguments', () => {
        expect(expressionParser.parse('f(1, 2)')).toEqual(dice.expression.forFunctionCall('f', f, [one, two]));
      });
    });

    describe('built-in functions', () => {
      describe('when context contains a function with the same name as a built-in function', () => {
        it('should use the function from the context', () => {
          expressionParserContext.functions.ceil = () => {
            return 42;
          };
          expect(expressionParser.parse('ceil(1)').evaluate().value).toBe(42);
        });
      });

      it('should parse the built-in ceil() function', () => {
        expect(expressionParser.parse('ceil(1)')).toEqual(
          dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [one])
        );
      });

      it('should parse the built-in cloneHighestRolls() function', () => {
        expect(expressionParser.parse('cloneHighestRolls(roll(3, d6), 2)')).toEqual(
          dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(3),
              dice.expression.forDie(expressionParserContext.bag.d(6)),
            ]),
            dice.expression.forConstant(2),
          ])
        );
      });

      it('should parse the built-in cloneLowestRolls() function', () => {
        expect(expressionParser.parse('cloneLowestRolls(roll(3, d6), 2)')).toEqual(
          dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(3),
              dice.expression.forDie(expressionParserContext.bag.d(6)),
            ]),
            dice.expression.forConstant(2),
          ])
        );
      });

      it('should parse the built-in dropHighestRolls() function', () => {
        expect(expressionParser.parse('dropHighestRolls(roll(3, d6), 2)')).toEqual(
          dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(3),
              dice.expression.forDie(expressionParserContext.bag.d(6)),
            ]),
            dice.expression.forConstant(2),
          ])
        );
      });

      it('should parse the built-in dropLowestRolls() function', () => {
        expect(expressionParser.parse('dropLowestRolls(roll(3, d6), 2)')).toEqual(
          dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(3),
              dice.expression.forDie(expressionParserContext.bag.d(6)),
            ]),
            dice.expression.forConstant(2),
          ])
        );
      });

      it('should parse the built-in floor() function', () => {
        expect(expressionParser.parse('floor(1)')).toEqual(
          dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [one])
        );
      });

      it('should parse the built-in roll() function', () => {
        expect(expressionParser.parse('roll(3, d6)')).toEqual(
          dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
            dice.expression.forConstant(3),
            dice.expression.forDie(expressionParserContext.bag.d(6)),
          ])
        );
      });

      it('should parse the built-in round() function', () => {
        expect(expressionParser.parse('round(1)')).toEqual(
          dice.expression.forFunctionCall('round', diceExpressionFunctions.round, [one])
        );
      });

      it('should parse the built-in sum() function', () => {
        expect(expressionParser.parse('sum(roll(2, d8))')).toEqual(
          dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
              dice.expression.forConstant(2),
              dice.expression.forDie(expressionParserContext.bag.d(8)),
            ]),
          ])
        );
      });

      it('should parse the built-in trunc() function', () => {
        expect(expressionParser.parse('trunc(1)')).toEqual(
          dice.expression.forFunctionCall('trunc', diceExpressionFunctions.trunc, [one])
        );
      });
    });
  });
});
