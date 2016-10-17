/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var dice = require('../../lib/dice');

describe('diceExpressionResult', function () {
    var three,
        four,
        d3,
        expressionResult,
        visitor;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
        d3 = dice.expressionResult.forDie(dice.bag.create().d(3));

        visitor = {
            visit: null
        };
        spyOn(visitor, 'visit');
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

        describe('.accept', function () {
            it('should visit the expression result, the augend expression result, and the addend expression result', function () {
                expressionResult = dice.expressionResult.forAddition(four, three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.augendExpressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.addendExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result and the array element expression results', function () {
                expressionResult = dice.expressionResult.forArray([three, four]);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.expressionResults[0]);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.expressionResults[1]);
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

        describe('.accept', function () {
            it('should visit the expression result', function () {
                expressionResult = dice.expressionResult.forConstant(5);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result', function () {
                expressionResult = dice.expressionResult.forDie(d3);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
            });
        });

        describe('.value', function () {
            it('should return die', function () {
                var die;

                die = dice.bag.create().d(3);
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

        describe('.accept', function () {
            it('should visit the expression result, the dividend expression result, and the divisor expression result', function () {
                expressionResult = dice.expressionResult.forDivision(three, four);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.dividendExpressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.divisorExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result and the argument list expression results', function () {
                expressionResult = dice.expressionResult.forFunctionCall(42, 'f', [three, four]);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.argumentListExpressionResults[0]);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.argumentListExpressionResults[1]);
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

        describe('.accept', function () {
            it('should visit the expression result and the child expression result', function () {
                expressionResult = dice.expressionResult.forGroup(three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.childExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result, the dividend expression result, and the divisor expression result', function () {
                expressionResult = dice.expressionResult.forModulo(four, three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.dividendExpressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.divisorExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result, the multiplicand expression result, and the multiplier expression result', function () {
                expressionResult = dice.expressionResult.forMultiplication(four, three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.multiplicandExpressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.multiplierExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result and the child expression result', function () {
                expressionResult = dice.expressionResult.forNegative(three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.childExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result and the child expression result', function () {
                expressionResult = dice.expressionResult.forPositive(three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.childExpressionResult);
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

        describe('.accept', function () {
            it('should visit the expression result, the minuend expression result, and the subtrahend expression result', function () {
                expressionResult = dice.expressionResult.forSubtraction(four, three);

                expressionResult.accept(visitor.visit);

                expect(visitor.visit).toHaveBeenCalledWith(expressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.minuendExpressionResult);
                expect(visitor.visit).toHaveBeenCalledWith(expressionResult.subtrahendExpressionResult);
            });
        });

        describe('.value', function () {
            it('should return difference between minuend and subtrahend', function () {
                expect(dice.expressionResult.forSubtraction(three, four).value).toBe(-1);
            });
        });
    });
});
