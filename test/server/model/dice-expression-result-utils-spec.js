/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const dice = require('../../../src/server/model/dice');
const diceExpressionResultUtils = require('../../../src/server/model/dice-expression-result-utils');

describe('diceExpressionResultUtils', () => {
    const bag = dice.bag.create();

    describe('.enumerateDieRollResults', () => {
        describe('when expression result contains no die rolls', () => {
            it('should enumerate zero die roll results', () => {
                // '3'
                const expressionResult = dice.expressionResult.forConstant(3);

                const dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

                expect(dieRollResults).toEqual([]);
            });
        });

        describe('when expression result contains one die roll', () => {
            it('should enumerate one die roll result', () => {
                // '1d6' -> 'sum(roll(1, d6))'
                const expressionResult = dice.expressionResult.forFunctionCall(3, 'sum', [
                    dice.expressionResult.forFunctionCall([3], 'roll', [
                        dice.expressionResult.forConstant(1),
                        dice.expressionResult.forDie(bag.d(6))
                    ])
                ]);

                const dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

                expect(dieRollResults).toEqual([
                    {
                        sides: 6,
                        value: 3
                    }
                ]);
            });
        });

        describe('when expression result contains multiple die rolls', () => {
            it('should enumerate multiple die roll results', () => {
                // '2d12 + 3d4' -> 'sum(roll(2, d12)) + sum(roll(3, d4))'
                const expressionResult = dice.expressionResult.forAddition(
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

                const dieRollResults = diceExpressionResultUtils.enumerateDieRollResults(expressionResult);

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
