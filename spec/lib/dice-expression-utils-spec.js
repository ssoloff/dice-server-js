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
var diceExpressionUtils = require('../../lib/dice-expression-utils');

describe('diceExpressionUtils', function () {
    var expressionParser = dice.expressionParser.create();

    describe('.enumerateDice', function () {
        describe('when expression contains no dice', function () {
            it('should enumerate zero dice', function () {
                expect(diceExpressionUtils.enumerateDice(expressionParser.parse('1+1'))).toEqual([]);
            });
        });

        describe('when expression contains one die', function () {
            it('should enumerate one die', function () {
                expect(diceExpressionUtils.enumerateDice(expressionParser.parse('1d6+1'))).toEqual([6]);
            });
        });

        describe('when expression contains multiple dice', function () {
            it('should enumerate multiple dice in ascending order of sides', function () {
                expect(diceExpressionUtils.enumerateDice(expressionParser.parse('2d12+3d4'))).toEqual([4, 4, 4, 12, 12]);
            });
        });

        describe('when expression contains one die as a function argument', function () {
            it('should enumerate one die', function () {
                expect(diceExpressionUtils.enumerateDice(expressionParser.parse('trunc(1d3+1d4)'))).toEqual([3, 4]);
            });
        });
    });
});
