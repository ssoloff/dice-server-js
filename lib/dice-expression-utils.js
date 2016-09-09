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

var _ = require('underscore');
var diceExpressionTypeIds = require('./dice-expression-type-ids');

/**
 * Provides utility methods for working with dice expressions.
 *
 * @module dice-expression-utils
 */
module.exports = {
    /**
     * Enumerates the dice contained in the specified expression.
     *
     * @param {module:dice-expression~Expression!} expression - The expression
     *      to examine.
     *
     * @returns {Number[]!} An array where each element represents the
     *      count of sides for each die contained in the specified expression.
     *
     * @example
     * // returns [4, 6, 6]
     * diceExpressionUtils.enumerateDice(diceExpressionParser.parse('2d6+1d4+1'));
     */
    enumerateDice: function (expression) {
        var diceSides = [];

        expression.accept(function (subexpression) {
            var dieCount,
                dieSides;

            if (subexpression.typeId === diceExpressionTypeIds.FUNCTION_CALL && subexpression.name === 'roll') {
                dieCount = subexpression.argumentListExpressions[0].constant;
                dieSides = subexpression.argumentListExpressions[1].die.sides;
                _(dieCount).times(function () {
                    diceSides.push(dieSides);
                });
            }
        });
        return _.sortBy(diceSides, _.identity);
    }
};
