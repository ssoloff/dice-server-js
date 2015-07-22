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

var dice = require('../../lib/dice');

describe('diceExpressionResult', function () {
    var three;
    var four;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
    });

    describe('.forAddition', function () {
        describe('when sum is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(undefined, four, three);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forAddition('7', four, three);
                }).toThrow();
            });
        });

        describe('when augend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(7, undefined, three);
                }).toThrow();
            });
        });

        describe('when addend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forAddition(7, four, undefined);
                }).toThrow();
            });
        });
    });

    describe('.forArray', function () {
        describe('when array is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forArray(undefined, [three, four]);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forArray('3', [three, four]);
                }).toThrow();
            });
        });

        describe('when expression results is not an array', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forArray([3, 4], three);
                }).toThrow();
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
    });

    describe('.forDie', function () {
        describe('when die is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDie(undefined);
                }).toThrow();
            });
        });
    });

    describe('.forDivision', function () {
        describe('when quotient is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(undefined, four, three);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forDivision('0.75', four, three);
                }).toThrow();
            });
        });

        describe('when dividend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(0.75, undefined, three);
                }).toThrow();
            });
        });

        describe('when divisor expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forDivision(0.75, four, undefined);
                }).toThrow();
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
    });

    describe('.forGroup', function () {
        describe('when child expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forGroup(undefined);
                }).toThrow();
            });
        });
    });

    describe('.forModulo', function () {
        describe('when remainder is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(undefined, four, three);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forModulo('1', four, three);
                }).toThrow();
            });
        });

        describe('when dividend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(1, undefined, three);
                }).toThrow();
            });
        });

        describe('when divisor expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forModulo(1, four, undefined);
                }).toThrow();
            });
        });
    });

    describe('.forMultiplication', function () {
        describe('when product is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(undefined, four, three);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forMultiplication('12', four, three);
                }).toThrow();
            });
        });

        describe('when multiplicand expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(12, undefined, three);
                }).toThrow();
            });
        });

        describe('when multiplier expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forMultiplication(12, four, undefined);
                }).toThrow();
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
    });

    describe('.forPositive', function () {
        describe('when child expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forPositive(undefined);
                }).toThrow();
            });
        });
    });

    describe('.forSubtraction', function () {
        describe('when difference is not a number', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(undefined, four, three);
                }).toThrow();
                expect(function () {
                    dice.expressionResult.forSubtraction('-1', four, three);
                }).toThrow();
            });
        });

        describe('when minuend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(-1, undefined, three);
                }).toThrow();
            });
        });

        describe('when subtrahend expression result is falsy', function () {
            it('should throw exception', function () {
                expect(function () {
                    dice.expressionResult.forSubtraction(-1, four, undefined);
                }).toThrow();
            });
        });
    });
});

