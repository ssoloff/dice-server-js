/*
 * Copyright (c) 2016 Steven Soloff
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

var dice = require('../../lib/dice');

describe('diceExpressionResult', function () {
    var three;
    var four;
    var d3;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
        d3 = dice.expressionResult.forDie(dice.bag.create().d(3));
    });

    describe('.forAddition', function () {
        describe('when augend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(undefined, four);
                }).toThrow();
            });
        });

        describe('when augend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(d3, four);
                }).toThrow();
            });
        });

        describe('when addend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(three, undefined);
                }).toThrow();
            });
        });

        describe('when addend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(three, d3);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return sum of augend and addend', function () {
                expect(dice.expressionResult.forAddition(three, four).value).toBe(7);
            });
        });
    });

    describe('.forArray', function () {
        describe('when expression results is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forArray(three);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return array of expression result values', function () {
                expect(dice.expressionResult.forArray([three, four]).value).toEqual([3, 4]);
            });
        });
    });

    describe('.forConstant', function () {
        describe('when constant is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forConstant(undefined);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forConstant('3');
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return constant', function () {
                expect(dice.expressionResult.forConstant(3).value).toBe(3);
            });
        });
    });

    describe('.forDie', function () {
        describe('when die is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDie(undefined);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return die', function () {
                var die = dice.bag.create().d(3);
                expect(dice.expressionResult.forDie(die).value).toBe(die);
            });
        });
    });

    describe('.forDivision', function () {
        describe('when dividend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(undefined, four);
                }).toThrow();
            });
        });

        describe('when dividend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(d3, four);
                }).toThrow();
            });
        });

        describe('when divisor expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(three, undefined);
                }).toThrow();
            });
        });

        describe('when divisor expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(three, d3);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return quotient of dividend and divisor', function () {
                expect(dice.expressionResult.forDivision(three, four).value).toBe(0.75);
            });
        });
    });

    describe('.forFunctionCall', function () {
        describe('when return value is not defined', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forFunctionCall(undefined, 'f', []);
                }).toThrow();
            });
        });

        describe('when name is not a string', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forFunctionCall(0, undefined, []);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forFunctionCall(0, 1, []);
                }).toThrow();
            });
        });

        describe('when argument list expression results is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forFunctionCall(0, 'f', undefined);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return return value', function () {
                expect(dice.expressionResult.forFunctionCall(42, 'f', []).value).toBe(42);
            });
        });
    });

    describe('.forGroup', function () {
        describe('when child expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forGroup(undefined);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return child expression result value', function () {
                expect(dice.expressionResult.forGroup(three).value).toBe(3);
            });
        });
    });

    describe('.forModulo', function () {
        describe('when dividend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(undefined, three);
                }).toThrow();
            });
        });

        describe('when dividend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(d3, three);
                }).toThrow();
            });
        });

        describe('when divisor expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(four, undefined);
                }).toThrow();
            });
        });

        describe('when divisor expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(four, d3);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return remainder of division of dividend and divisor', function () {
                expect(dice.expressionResult.forModulo(four, three).value).toBe(1);
            });
        });
    });

    describe('.forMultiplication', function () {
        describe('when multiplicand expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(undefined, four);
                }).toThrow();
            });
        });

        describe('when multiplicand expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(d3, four);
                }).toThrow();
            });
        });

        describe('when multiplier expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(three, undefined);
                }).toThrow();
            });
        });

        describe('when multiplier expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(three, d3);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return product of multiplicand and multiplier', function () {
                expect(dice.expressionResult.forMultiplication(three, four).value).toBe(12);
            });
        });
    });

    describe('.forNegative', function () {
        describe('when child expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forNegative(undefined);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return negative of child expression result value', function () {
                expect(dice.expressionResult.forNegative(three).value).toBe(-3);
            });
        });
    });

    describe('.forPositive', function () {
        describe('when child expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forPositive(undefined);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return child expression result value', function () {
                expect(dice.expressionResult.forPositive(three).value).toBe(3);
            });
        });
    });

    describe('.forSubtraction', function () {
        describe('when minuend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(undefined, four);
                }).toThrow();
            });
        });

        describe('when minuend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(d3, four);
                }).toThrow();
            });
        });

        describe('when subtrahend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(three, undefined);
                }).toThrow();
            });
        });

        describe('when subtrahend expression result value is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(three, d3);
                }).toThrow();
            });
        });

        describe('.value', function () {
            it('should return difference between minuend and subtrahend', function () {
                expect(dice.expressionResult.forSubtraction(three, four).value).toBe(-1);
            });
        });
    });
});
