/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var dice = require('../../../src/server/model/dice');

describe('diceExpressionFormatter', function () {
    var three,
        four,
        expression;

    beforeEach(function () {
        three = dice.expression.forConstant(3);
        four = dice.expression.forConstant(4);
    });

    describe('.format', function () {
        describe('when expression is an addition expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forAddition(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe('3 + 4');
            });
        });

        describe('when expression is an array expression', function () {
            describe('when array contains one element', function () {
                it('should return formatted expression', function () {
                    expression = dice.expression.forArray([three]);
                    expect(dice.expressionFormatter.format(expression)).toBe('[3]');
                });
            });

            describe('when array contains two elements', function () {
                it('should return formatted expression', function () {
                    expression = dice.expression.forArray([three, four]);
                    expect(dice.expressionFormatter.format(expression)).toBe('[3, 4]');
                });
            });
        });

        describe('when expression is a constant expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forConstant(42);
                expect(dice.expressionFormatter.format(expression)).toBe('42');
            });
        });

        describe('when expression is a die expression', function () {
            it('should return formatted expression', function () {
                var d3 = dice.bag.create().d(3);

                expression = dice.expression.forDie(d3);
                expect(dice.expressionFormatter.format(expression)).toBe('d3');
            });
        });

        describe('when expression is a division expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forDivision(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe('3 / 4');
            });
        });

        describe('when expression is a function call expression', function () {
            describe('when zero arguments specified', function () {
                it('should return formatted expression', function () {
                    expression = dice.expression.forFunctionCall('max', Math.max, []);
                    expect(dice.expressionFormatter.format(expression)).toBe('max()');
                });
            });

            describe('when one argument specified', function () {
                it('should return formatted expression', function () {
                    expression = dice.expression.forFunctionCall('max', Math.max, [three]);
                    expect(dice.expressionFormatter.format(expression)).toBe('max(3)');
                });
            });

            describe('when two arguments specified', function () {
                it('should return formatted expression', function () {
                    expression = dice.expression.forFunctionCall('max', Math.max, [three, four]);
                    expect(dice.expressionFormatter.format(expression)).toBe('max(3, 4)');
                });
            });
        });

        describe('when expression is a group expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forGroup(three);
                expect(dice.expressionFormatter.format(expression)).toBe('(3)');
            });
        });

        describe('when expression is a modulo expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forModulo(four, three);
                expect(dice.expressionFormatter.format(expression)).toBe('4 % 3');
            });
        });

        describe('when expression is a multiplication expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forMultiplication(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe('3 * 4');
            });
        });

        describe('when expression is a negative expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forNegative(three);
                expect(dice.expressionFormatter.format(expression)).toBe('-3');
            });
        });

        describe('when expression is a positive expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forPositive(three);
                expect(dice.expressionFormatter.format(expression)).toBe('+3');
            });
        });

        describe('when expression is a subtraction expression', function () {
            it('should return formatted expression', function () {
                expression = dice.expression.forSubtraction(three, four);
                expect(dice.expressionFormatter.format(expression)).toBe('3 - 4');
            });
        });

        describe('when expression is of an unknown type', function () {
            it('should throw an exception', function () {
                expect(function () {
                    dice.expressionFormatter.format({
                        typeId: '__unknown__'
                    });
                }).toThrow();
            });
        });
    });
});
