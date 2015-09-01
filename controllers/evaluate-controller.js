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

require('../lib/number-polyfills');

var _ = require('underscore');
var dice = require('../lib/dice');

module.exports = (function () {
    function createRandomNumberGenerator(randomNumberGeneratorSpecification) {
        switch (randomNumberGeneratorSpecification.name) {
            case 'constantMax':
                return function () {
                    return 1.0 - Number.EPSILON;
                };

            case 'uniform':
                return Math.random;
        }

        throw new Error('unknown random number generator "' + randomNumberGeneratorSpecification.name + '"');
    }

    function createResponse(request) {
        var response = {};

        try {
            var content = {};

            var randomNumberGeneratorSpecification = getRandomNumberGeneratorSpecification(request);
            content.randomNumberGenerator = randomNumberGeneratorSpecification;

            var expressionParserContext = dice.expressionParser.createDefaultContext();
            expressionParserContext.bag = dice.bag.create(createRandomNumberGenerator(randomNumberGeneratorSpecification));
            var expressionParser = dice.expressionParser.create(expressionParserContext);
            var expression = expressionParser.parse(request.expression.text);
            content.expression = {
                canonicalText: dice.expressionFormatter.format(expression),
                text: request.expression.text
            };

            var expressionResult = expression.evaluate();
            if (!_.isFinite(expressionResult.value)) {
                throw new Error('expression does not evaluate to a finite number');
            }
            content.expressionResult = {
                text: dice.expressionResultFormatter.format(expressionResult),
                value: expressionResult.value
            };

            response = {
                success: content
            };
        }
        catch (e) {
            response = {
                failure: {
                    message: e.message
                }
            };
        }

        return response;
    }

    function getRandomNumberGeneratorSpecification(request) {
        return request.randomNumberGenerator || {name: 'uniform'};
    }

    return {
        evaluate: function (req, res) {
            var request = req.body;
            var response = createResponse(request);
            res.status(200).json(response);
        }
    };
})();

