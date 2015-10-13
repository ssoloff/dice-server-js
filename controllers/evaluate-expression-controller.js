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

var _ = require('underscore');
var controllerUtils = require('./support/controller-utils');
var dice = require('../lib/dice');
var httpStatus = require('http-status-codes');
var Random = require('random-js');
var security = require('./support/security');

module.exports = {
    create: function (controllerData) {
        function createRandomNumberGenerator(randomNumberGeneratorSpecification) {
            switch (randomNumberGeneratorSpecification.name) {
                case 'constantMax':
                    return function (sides) {
                        return sides;
                    };

                case 'uniform':
                    return function (sides) {
                        return Random.die(sides)(Random.engines.nativeMath);
                    };
            }

            throw controllerUtils.createControllerError(
                httpStatus.BAD_REQUEST,
                'unknown random number generator "' + randomNumberGeneratorSpecification.name + '"'
            );
        }

        function createResponseBody(request) {
            var requestBody = request.body;
            var responseBody = {};

            var randomNumberGeneratorSpecification = getRandomNumberGeneratorSpecification(requestBody);
            responseBody.randomNumberGenerator = randomNumberGeneratorSpecification;

            var expression = parseExpressionText(requestBody.expression.text, randomNumberGeneratorSpecification);
            responseBody.expression = {
                canonicalText: formatExpression(expression),
                text: requestBody.expression.text
            };

            var expressionResult = expression.evaluate();
            if (!_.isFinite(expressionResult.value)) {
                throw controllerUtils.createControllerError(
                    httpStatus.BAD_REQUEST,
                    'expression does not evaluate to a finite number'
                );
            }
            responseBody.expressionResult = {
                text: dice.expressionResultFormatter.format(expressionResult),
                value: expressionResult.value
            };

            return responseBody;
        }

        function formatExpression(expression) {
            return dice.expressionFormatter.format(expression);
        }

        function getDefaultRandomNumberGeneratorSpecification() {
            return {
                name: 'uniform'
            };
        }

        function getRandomNumberGeneratorSpecification(requestBody) {
            var randomNumberGenerator = requestBody.randomNumberGenerator;
            if (!randomNumberGenerator) {
                return getDefaultRandomNumberGeneratorSpecification();
            }

            if (!isSignatureValid(randomNumberGenerator.content, randomNumberGenerator.signature)) {
                throw controllerUtils.createControllerError(
                    httpStatus.BAD_REQUEST,
                    'random number generator specification signature is invalid'
                );
            }
            return randomNumberGenerator.content;
        }

        function isSignatureValid(content, signature) {
            return security.verifySignature(content, signature, controllerData.publicKey);
        }

        function parseExpressionText(expressionText, randomNumberGeneratorSpecification) {
            var expressionParserContext = dice.expressionParser.createDefaultContext();
            expressionParserContext.bag = dice.bag.create(createRandomNumberGenerator(randomNumberGeneratorSpecification));
            var expressionParser = dice.expressionParser.create(expressionParserContext);
            try {
                return expressionParser.parse(expressionText);
            } catch (e) {
                throw controllerUtils.createControllerError(httpStatus.BAD_REQUEST, e.message);
            }
        }

        return {
            evaluateExpression: function (request, response) {
                try {
                    controllerUtils.setSuccessResponse(response, createResponseBody(request));
                } catch (e) {
                    controllerUtils.setFailureResponse(response, e);
                }
            }
        };
    }
};

