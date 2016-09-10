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
var diceExpressionResultUtils = require('../../lib/dice-expression-result-utils');

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
