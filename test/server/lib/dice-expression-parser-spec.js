/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var dice = require('../../../src/server/lib/dice'),
    diceExpressionFunctions = require('../../../src/server/lib/dice-expression-functions'),
    diceTest = require('./test-support/dice-test');

describe('diceExpressionParser', function () {
    var expressionParser,
        expressionParserContext,
        f = Math.max,
        one,
        two,
        three;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(diceTest.isDiceExpressionEqual);
        expressionParserContext = dice.expressionParser.createDefaultContext();
        expressionParserContext.functions.f = f;
        expressionParser = dice.expressionParser.create(expressionParserContext);
        one = dice.expression.forConstant(1);
        two = dice.expression.forConstant(2);
        three = dice.expression.forConstant(3);
    });

    describe('.create', function () {
        it('should use a default context if one is not provided', function () {
            expressionParser = dice.expressionParser.create();
            expect(expressionParser.parse('trunc(3/2)').evaluate().value).toBe(1);
        });

        it('should use the dice bag in the context', function () {
            expressionParserContext.bag = diceTest.createBagThatProvidesDiceThatAlwaysRollOne();
            expect(expressionParser.parse('3d6').evaluate().value).toBe(3);
        });
    });

    describe('#parse', function () {
        describe('when source empty', function () {
            it('should throw exception', function () {
                expect(function () {
                    expressionParser.parse('');
                }).toThrow();
            });
        });

        describe('literals', function () {
            it('should parse an integer literal', function () {
                expect(expressionParser.parse('2')).toEqual(two);
            });

            it('should parse an array literal', function () {
                expect(expressionParser.parse('[]')).toEqual(dice.expression.forArray([]));
                expect(expressionParser.parse('[1]')).toEqual(dice.expression.forArray([one]));
                expect(expressionParser.parse('[1, 2]')).toEqual(dice.expression.forArray([one, two]));
            });

            it('should parse a die literal', function () {
                expect(expressionParser.parse('d6')).toEqual(dice.expression.forDie(expressionParserContext.bag.d(6)));
            });

            it('should parse a percentile die literal', function () {
                expect(expressionParser.parse('d%')).toEqual(dice.expression.forDie(expressionParserContext.bag.d(100)));
            });

            it('should parse a dice roll literal', function () {
                expect(expressionParser.parse('3d6')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ])
                    ])
                );
            });

            it('should parse a percentile dice roll literal', function () {
                expect(expressionParser.parse('2d%')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(2),
                            dice.expression.forDie(expressionParserContext.bag.d(100))
                        ])
                    ])
                );
            });

            it('should parse a dice roll and clone highest literal', function () {
                expect(expressionParser.parse('4d6+H')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(1)
                        ])
                    ])
                );
                expect(expressionParser.parse('4d6+2H')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(2)
                        ])
                    ])
                );
            });

            it('should parse a dice roll and clone lowest literal', function () {
                expect(expressionParser.parse('4d6+L')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(1)
                        ])
                    ])
                );
                expect(expressionParser.parse('4d6+2L')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(2)
                        ])
                    ])
                );
            });

            it('should parse a dice roll and drop highest literal', function () {
                expect(expressionParser.parse('4d6-H')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(1)
                        ])
                    ])
                );
                expect(expressionParser.parse('4d6-2H')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(2)
                        ])
                    ])
                );
            });

            it('should parse a dice roll and drop lowest literal', function () {
                expect(expressionParser.parse('4d6-L')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(1)
                        ])
                    ])
                );
                expect(expressionParser.parse('4d6-2L')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
                            dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                                dice.expression.forConstant(4),
                                dice.expression.forDie(expressionParserContext.bag.d(6))
                            ]),
                            dice.expression.forConstant(2)
                        ])
                    ])
                );
            });
        });

        describe('arithmetic operators', function () {
            it('should parse the addition of two constants', function () {
                expect(expressionParser.parse('1 + 2')).toEqual(dice.expression.forAddition(one, two));
            });

            it('should parse the subtraction of two constants', function () {
                expect(expressionParser.parse('1 - 2')).toEqual(dice.expression.forSubtraction(one, two));
            });

            it('should parse the multiplication of two constants', function () {
                expect(expressionParser.parse('1 * 2')).toEqual(dice.expression.forMultiplication(one, two));
            });

            it('should parse the division of two constants', function () {
                expect(expressionParser.parse('1 / 2')).toEqual(dice.expression.forDivision(one, two));
            });

            it('should parse the modulo of two constants', function () {
                expect(expressionParser.parse('3 % 2')).toEqual(dice.expression.forModulo(three, two));
            });
        });

        describe('extended divide and round operators', function () {
            it('should parse divide and round towards zero', function () {
                expect(expressionParser.parse('1 // 2')).toEqual(
                    dice.expression.forFunctionCall('trunc', diceExpressionFunctions.trunc, [
                        dice.expression.forDivision(one, two)
                    ])
                );
            });

            it('should parse divide and round to nearest', function () {
                expect(expressionParser.parse('1 /~ 2')).toEqual(
                    dice.expression.forFunctionCall('round', diceExpressionFunctions.round, [
                        dice.expression.forDivision(one, two)
                    ])
                );
            });

            it('should parse divide and round up', function () {
                expect(expressionParser.parse('1 /+ 2')).toEqual(
                    dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [
                        dice.expression.forDivision(one, two)
                    ])
                );
            });

            it('should parse divide and round down', function () {
                expect(expressionParser.parse('1 /- 2')).toEqual(
                    dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [
                        dice.expression.forDivision(one, two)
                    ])
                );
            });
        });

        describe('unary operators', function () {
            it('should parse positive', function () {
                expect(expressionParser.parse('+1')).toEqual(dice.expression.forPositive(one));
            });

            it('should parse negative', function () {
                expect(expressionParser.parse('-1')).toEqual(dice.expression.forNegative(one));
            });
        });

        describe('operator precedence', function () {
            it('should give precedence to multiplication over addition', function () {
                expect(expressionParser.parse('3*1+1*3')).toEqual(
                    dice.expression.forAddition(
                        dice.expression.forMultiplication(three, one),
                        dice.expression.forMultiplication(one, three)
                    )
                );
            });

            it('should allow grouping to override operator precedence', function () {
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

            it('should give precedence to divide and round down operator over unary negative operator', function () {
                expect(expressionParser.parse('1/-2')).toEqual(
                    dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [
                        dice.expression.forDivision(one, two)
                    ])
                );
                expect(expressionParser.parse('1/ -2')).toEqual(
                    dice.expression.forDivision(one, dice.expression.forNegative(two))
                );
            });

            it('should give precedence to divide and round up operator over unary positive operator', function () {
                expect(expressionParser.parse('1/+2')).toEqual(
                    dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [
                        dice.expression.forDivision(one, two)
                    ])
                );
                expect(expressionParser.parse('1/ +2')).toEqual(
                    dice.expression.forDivision(one, dice.expression.forPositive(two))
                );
            });
        });

        describe('function calls', function () {
            describe('when function is unknown', function () {
                it('should throw exception', function () {
                    expect(function () {
                        expressionParser.parse('unknown()');
                    }).toThrow();
                });
            });

            it('should parse a function call with zero arguments', function () {
                expect(expressionParser.parse('f()')).toEqual(dice.expression.forFunctionCall('f', f, []));
            });

            it('should parse a function call with one argument', function () {
                expect(expressionParser.parse('f(1)')).toEqual(dice.expression.forFunctionCall('f', f, [one]));
            });

            it('should parse a function call with two arguments', function () {
                expect(expressionParser.parse('f(1, 2)')).toEqual(dice.expression.forFunctionCall('f', f, [one, two]));
            });
        });

        describe('built-in functions', function () {
            describe('when context contains a function with the same name as a built-in function', function () {
                it('should use the function from the context', function () {
                    expressionParserContext.functions.ceil = function () {
                        return 42;
                    };
                    expect(expressionParser.parse('ceil(1)').evaluate().value).toBe(42);
                });
            });

            it('should parse the built-in ceil() function', function () {
                expect(expressionParser.parse('ceil(1)')).toEqual(dice.expression.forFunctionCall('ceil', diceExpressionFunctions.ceil, [one]));
            });

            it('should parse the built-in cloneHighestRolls() function', function () {
                expect(expressionParser.parse('cloneHighestRolls(roll(3, d6), 2)')).toEqual(
                    dice.expression.forFunctionCall('cloneHighestRolls', diceExpressionFunctions.cloneHighestRolls, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ]),
                        dice.expression.forConstant(2)
                    ])
                );
            });

            it('should parse the built-in cloneLowestRolls() function', function () {
                expect(expressionParser.parse('cloneLowestRolls(roll(3, d6), 2)')).toEqual(
                    dice.expression.forFunctionCall('cloneLowestRolls', diceExpressionFunctions.cloneLowestRolls, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ]),
                        dice.expression.forConstant(2)
                    ])
                );
            });

            it('should parse the built-in dropHighestRolls() function', function () {
                expect(expressionParser.parse('dropHighestRolls(roll(3, d6), 2)')).toEqual(
                    dice.expression.forFunctionCall('dropHighestRolls', diceExpressionFunctions.dropHighestRolls, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ]),
                        dice.expression.forConstant(2)
                    ])
                );
            });

            it('should parse the built-in dropLowestRolls() function', function () {
                expect(expressionParser.parse('dropLowestRolls(roll(3, d6), 2)')).toEqual(
                    dice.expression.forFunctionCall('dropLowestRolls', diceExpressionFunctions.dropLowestRolls, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(3),
                            dice.expression.forDie(expressionParserContext.bag.d(6))
                        ]),
                        dice.expression.forConstant(2)
                    ])
                );
            });

            it('should parse the built-in floor() function', function () {
                expect(expressionParser.parse('floor(1)')).toEqual(dice.expression.forFunctionCall('floor', diceExpressionFunctions.floor, [one]));
            });

            it('should parse the built-in roll() function', function () {
                expect(expressionParser.parse('roll(3, d6)')).toEqual(
                    dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                        dice.expression.forConstant(3),
                        dice.expression.forDie(expressionParserContext.bag.d(6))
                    ])
                );
            });

            it('should parse the built-in round() function', function () {
                expect(expressionParser.parse('round(1)')).toEqual(dice.expression.forFunctionCall('round', diceExpressionFunctions.round, [one]));
            });

            it('should parse the built-in sum() function', function () {
                expect(expressionParser.parse('sum(roll(2, d8))')).toEqual(
                    dice.expression.forFunctionCall('sum', diceExpressionFunctions.sum, [
                        dice.expression.forFunctionCall('roll', diceExpressionFunctions.roll, [
                            dice.expression.forConstant(2),
                            dice.expression.forDie(expressionParserContext.bag.d(8))
                        ])
                    ])
                );
            });

            it('should parse the built-in trunc() function', function () {
                expect(expressionParser.parse('trunc(1)')).toEqual(dice.expression.forFunctionCall('trunc', diceExpressionFunctions.trunc, [one]));
            });
        });
    });
});