/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var _ = require('underscore');
var dice = require('../../src/lib/dice');
var diceTest = require('./test-support/dice-test');

describe('diceExpression', function () {
    var three,
        four,
        expression;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(diceTest.isDiceExpressionResultEqual);
        three = dice.expression.forConstant(3);
        four = dice.expression.forConstant(4);
    });

    describe('.forAddition', function () {
        describe('when augend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forAddition(undefined, three);
                }).toThrow();
            });
        });

        describe('when addend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forAddition(four, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to sum of augend and addend', function () {
                expression = dice.expression.forAddition(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forAddition(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                expression = dice.expression.forAddition(dice.expression.forAddition(four, three), three);
                expect(expression.evaluate().value).toBe(10);
            });
        });
    });

    describe('.forArray', function () {
        describe('when expressions is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forArray(undefined);
                }).toThrow();
                expect(function () {
                    dice.expression.forArray('3');
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to array of expression result values', function () {
                expression = dice.expression.forArray([three, four]);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forArray([
                        dice.expressionResult.forConstant(three.constant),
                        dice.expressionResult.forConstant(four.constant)
                    ])
                );
            });
        });
    });

    describe('.forConstant', function () {
        describe('when constant is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forConstant(undefined);
                }).toThrow();
                expect(function () {
                    dice.expression.forConstant('3');
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to constant', function () {
                var constant = 5;

                expression = dice.expression.forConstant(constant);
                expect(expression.evaluate()).toEqual(dice.expressionResult.forConstant(constant));
            });
        });
    });

    describe('.forDie', function () {
        describe('when die is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forDie(undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to die', function () {
                var d3 = dice.bag.create().d(3);

                expression = dice.expression.forDie(d3);
                expect(expression.evaluate()).toEqual(dice.expressionResult.forDie(d3));
            });
        });
    });

    describe('.forDivision', function () {
        describe('when dividend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forDivision(undefined, three);
                }).toThrow();
            });
        });

        describe('when divisor expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forDivision(four, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to quotient of dividend and divisor', function () {
                expression = dice.expression.forDivision(three, four);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forDivision(
                        dice.expressionResult.forConstant(three.constant),
                        dice.expressionResult.forConstant(four.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                expression = dice.expression.forDivision(dice.expression.forDivision(three, four), four);
                expect(expression.evaluate().value).toBe(0.1875);
            });
        });
    });

    describe('.forFunctionCall', function () {
        function f() {
            function sum(first, second) {
                return first + second;
            }
            return 42 + _.toArray(arguments).reduce(sum, 0);
        }

        describe('when function name is not a string', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forFunctionCall(undefined, f, []);
                }).toThrow();
                expect(function () {
                    dice.expression.forFunctionCall(1, f, []);
                }).toThrow();
            });
        });

        describe('when function is not a function', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forFunctionCall('f', undefined, []);
                }).toThrow();
                expect(function () {
                    dice.expression.forFunctionCall('f', 'return 1;', []);
                }).toThrow();
            });
        });

        describe('when function argument list expressions is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forFunctionCall('f', f, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            describe('when zero arguments specified', function () {
                it('should return result with value equal to function return value', function () {
                    expression = dice.expression.forFunctionCall('f', f, []);
                    expect(expression.evaluate()).toEqual(
                        dice.expressionResult.forFunctionCall(
                            42,
                            'f',
                            []
                        )
                    );
                });
            });

            describe('when one argument specified', function () {
                it('should return result with value equal to function return value', function () {
                    expression = dice.expression.forFunctionCall('f', f, [three]);
                    expect(expression.evaluate()).toEqual(
                        dice.expressionResult.forFunctionCall(
                            45,
                            'f',
                            [
                                dice.expressionResult.forConstant(three.constant)
                            ]
                        )
                    );
                });
            });

            describe('when two arguments specified', function () {
                it('should return result with value equal to function return value', function () {
                    expression = dice.expression.forFunctionCall('f', f, [three, four]);
                    expect(expression.evaluate()).toEqual(
                        dice.expressionResult.forFunctionCall(
                            49,
                            'f',
                            [
                                dice.expressionResult.forConstant(three.constant),
                                dice.expressionResult.forConstant(four.constant)
                            ]
                        )
                    );
                });
            });
        });
    });

    describe('.forGroup', function () {
        describe('when child expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forGroup(undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to child expression result value', function () {
                expression = dice.expression.forGroup(three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forGroup(
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });
        });
    });

    describe('.forModulo', function () {
        describe('when dividend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forModulo(undefined, three);
                }).toThrow();
            });
        });

        describe('when divisor expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forModulo(four, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to remainder of division of dividend and divisor', function () {
                expression = dice.expression.forModulo(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forModulo(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                expression = dice.expression.forModulo(dice.expression.forModulo(three, four), three);
                expect(expression.evaluate().value).toBe(0);
            });
        });
    });

    describe('.forMultiplication', function () {
        describe('when multiplicand expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forMultiplication(undefined, three);
                }).toThrow();
            });
        });

        describe('when multiplier expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forMultiplication(four, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to product of multiplicand and multiplier', function () {
                expression = dice.expression.forMultiplication(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forMultiplication(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                expression = dice.expression.forMultiplication(dice.expression.forMultiplication(four, three), three);
                expect(expression.evaluate().value).toBe(36);
            });
        });
    });

    describe('.forNegative', function () {
        describe('when child expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forNegative(undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to negative of child expression result value', function () {
                expression = dice.expression.forNegative(three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forNegative(
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });
        });
    });

    describe('.forPositive', function () {
        describe('when child expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forPositive(undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to child expression result value', function () {
                expression = dice.expression.forPositive(three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forPositive(
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });
        });
    });

    describe('.forSubtraction', function () {
        describe('when minuend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forSubtraction(undefined, three);
                }).toThrow();
            });
        });

        describe('when subtrahend expression is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expression.forSubtraction(four, undefined);
                }).toThrow();
            });
        });

        describe('.evaluate', function () {
            it('should return result with value equal to difference between minuend and subtrahend', function () {
                expression = dice.expression.forSubtraction(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forSubtraction(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                expression = dice.expression.forSubtraction(dice.expression.forSubtraction(four, three), three);
                expect(expression.evaluate().value).toBe(-2);
            });
        });
    });
});
