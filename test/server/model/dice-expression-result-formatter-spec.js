/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const dice = require('../../../src/server/model/dice');

describe('diceExpressionResultFormatter', function () {
    let three;
    let four;

    beforeEach(function () {
        three = dice.expressionResult.forConstant(3);
        four = dice.expressionResult.forConstant(4);
    });

    describe('.format', function () {
        describe('when expression result is an addition expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forAddition(three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('3 + 4');
            });
        });

        describe('when expression result is an array expression result', function () {
            describe('when array contains one element', function () {
                it('should return formatted expression result', function () {
                    const expressionResult = dice.expressionResult.forArray([three]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe('[3]');
                });
            });

            describe('when array contains two elements', function () {
                it('should return formatted expression result', function () {
                    const expressionResult = dice.expressionResult.forArray([three, four]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe('[3, 4]');
                });
            });
        });

        describe('when expression result is a constant expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forConstant(42);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('42');
            });
        });

        describe('when expression result is a die expression result', function () {
            it('should return formatted expression result', function () {
                const d3 = dice.bag.create().d(3);
                const expressionResult = dice.expressionResult.forDie(d3);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('d3');
            });
        });

        describe('when expression result is a division expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forDivision(three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('3 / 4');
            });
        });

        describe('when expression is a function call expression', function () {
            describe('when zero arguments specified', function () {
                it('should return formatted expression result', function () {
                    const expressionResult = dice.expressionResult.forFunctionCall(0, 'f', []);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe('[f() -> 0]');
                });
            });

            describe('when one argument specified', function () {
                it('should return formatted expression result', function () {
                    const expressionResult = dice.expressionResult.forFunctionCall(1, 'f', [three]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe('[f(3) -> 1]');
                });
            });

            describe('when two arguments specified', function () {
                it('should return formatted expression result', function () {
                    const expressionResult = dice.expressionResult.forFunctionCall(2, 'f', [three, four]);
                    expect(dice.expressionResultFormatter.format(expressionResult)).toBe('[f(3, 4) -> 2]');
                });
            });
        });

        describe('when expression result is a group expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forGroup(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('(3)');
            });
        });

        describe('when expression result is a modulo expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forModulo(four, three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('4 % 3');
            });
        });

        describe('when expression result is a multiplication expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forMultiplication(three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('3 * 4');
            });
        });

        describe('when expression result is a negative expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forNegative(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('-3');
            });
        });

        describe('when expression result is a positive expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forPositive(three);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('+3');
            });
        });

        describe('when expression result is a subtraction expression result', function () {
            it('should return formatted expression result', function () {
                const expressionResult = dice.expressionResult.forSubtraction(three, four);
                expect(dice.expressionResultFormatter.format(expressionResult)).toBe('3 - 4');
            });
        });

        describe('when expression result is of an unknown type', function () {
            it('should throw an exception', function () {
                expect(function () {
                    dice.expressionResultFormatter.format({
                        typeId: '__unknown__'
                    });
                }).toThrow();
            });
        });
    });
});
