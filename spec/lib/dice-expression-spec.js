/*
 * Copyright (c) 2015 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var _ = require('underscore');
var dice = require('../../lib/dice');
var diceTest = require('./dice-test');

describe('diceExpression', function () {
    var three;
    var four;

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
                var expression = dice.expression.forAddition(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forAddition(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                var expression = dice.expression.forAddition(dice.expression.forAddition(four, three), three);
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
                var expression = dice.expression.forArray([three, four]);
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
                var expression = dice.expression.forConstant(constant);
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
                var expression = dice.expression.forDie(d3);
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
                var expression = dice.expression.forDivision(three, four);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forDivision(
                        dice.expressionResult.forConstant(three.constant),
                        dice.expressionResult.forConstant(four.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                var expression = dice.expression.forDivision(dice.expression.forDivision(three, four), four);
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
                    var expression = dice.expression.forFunctionCall('f', f, []);
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
                    var expression = dice.expression.forFunctionCall('f', f, [three]);
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
                    var expression = dice.expression.forFunctionCall('f', f, [three, four]);
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
                var expression = dice.expression.forGroup(three);
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
                var expression = dice.expression.forModulo(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forModulo(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                var expression = dice.expression.forModulo(dice.expression.forModulo(three, four), three);
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
                var expression = dice.expression.forMultiplication(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forMultiplication(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                var expression = dice.expression.forMultiplication(dice.expression.forMultiplication(four, three), three);
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
                var expression = dice.expression.forNegative(three);
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
                var expression = dice.expression.forPositive(three);
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
                var expression = dice.expression.forSubtraction(four, three);
                expect(expression.evaluate()).toEqual(
                    dice.expressionResult.forSubtraction(
                        dice.expressionResult.forConstant(four.constant),
                        dice.expressionResult.forConstant(three.constant)
                    )
                );
            });

            it('should evaluate subexpressions', function () {
                var expression = dice.expression.forSubtraction(dice.expression.forSubtraction(four, three), three);
                expect(expression.evaluate().value).toBe(-2);
            });
        });
    });
});

