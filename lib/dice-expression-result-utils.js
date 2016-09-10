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

var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides utility methods for working with dice expression results.
 *
 * @module dice-expression-result-utils
 */
module.exports = {
    /**
     * Enumerates the die roll results contained in the specified expression
     * result.
     *
     * @param {module:dice-expression-result~ExpressionResult!} expressionResult -
     *      The expression result to examine.
     *
     * @returns {module:dice-expression-result-utils~DieRollResult[]!}
     *      An array containing the enumerated die roll results.
     *
     * @example
     * // returns [
     * //     {
     * //         sides: 6,
     * //         value: 2
     * //     },
     * //     {
     * //         sides: 6,
     * //         value: 5
     * //     },
     * //     {
     * //         sides: 4,
     * //         value: 3
     * //     }
     * // ]
     * //
     * // (values may differ)
     * diceExpressionResultUtils.enumerateDieRollResults(diceExpressionParser.parse('2d6+1d4+1'));
     */
    enumerateDieRollResults: function (expressionResult) {
        var dieRollResults = [];

        expressionResult.accept(function (expressionResult) {
            var dieRollValues,
                dieSides;

            if (expressionResult.typeId === diceExpressionTypeIds.FUNCTION_CALL && expressionResult.name === 'roll') {
                dieRollValues = expressionResult.value;
                dieSides = expressionResult.argumentListExpressionResults[1].value.sides;
                dieRollValues.forEach(function (dieRollValue) {
                    dieRollResults.push({
                        sides: dieSides,
                        value: dieRollValue
                    });
                });
            }
        });
        return dieRollResults;
    }
};
