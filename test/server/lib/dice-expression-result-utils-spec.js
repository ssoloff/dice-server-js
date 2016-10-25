/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var dice = require('../../../src/server/lib/dice'),
    diceExpressionResultUtils = require('../../../src/server/lib/dice-expression-result-utils');

describe('diceExpressionResultUtils', function () {
    var bag = dice.bag.create(),
        expressionResult;

    describe('.enumerateDieRollResults', function () {
        var dieRollResults;

        describe('when expression result contains no die rolls', function () {
            it('should enumerate zero die roll results', function () {
                // '3'
                expressionResult = dice.expressionResult.forConstant(3);

                dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

                expect(dieRollResults).toEqual([]);
            });
        });

        describe('when expression result contains one die roll', function () {
            it('should enumerate one die roll result', function () {
                // '1d6' -> 'sum(roll(1, d6))'
                expressionResult = dice.expressionResult.forFunctionCall(3, 'sum', [
                    dice.expressionResult.forFunctionCall([3], 'roll', [
                        dice.expressionResult.forConstant(1),
                        dice.expressionResult.forDie(bag.d(6))
                    ])
                ]);

                dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

                expect(dieRollResults).toEqual([
                    {
                        sides: 6,
                        value: 3
                    }
                ]);
            });
        });

        describe('when expression result contains multiple die rolls', function () {
            it('should enumerate multiple die roll results', function () {
                // '2d12 + 3d4' -> 'sum(roll(2, d12)) + sum(roll(3, d4))'
                expressionResult = dice.expressionResult.forAddition(
                    dice.expressionResult.forFunctionCall(18, 'sum', [
                        dice.expressionResult.forFunctionCall([7, 11], 'roll', [
                            dice.expressionResult.forConstant(2),
                            dice.expressionResult.forDie(bag.d(12))
                        ])
                    ]),
                    dice.expressionResult.forFunctionCall(6, 'sum', [
                        dice.expressionResult.forFunctionCall([2, 1, 3], 'roll', [
                            dice.expressionResult.forConstant(3),
                            dice.expressionResult.forDie(bag.d(4))
                        ])
                    ])
                );

                dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

                expect(dieRollResults).toEqual([
                    {
                        sides: 12,
                        value: 7
                    },
                    {
                        sides: 12,
                        value: 11
                    },
                    {
                        sides: 4,
                        value: 2
                    },
                    {
                        sides: 4,
                        value: 1
                    },
                    {
                        sides: 4,
                        value: 3
                    }
                ]);
            });
        });
    });
});
