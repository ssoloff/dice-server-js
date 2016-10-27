/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var _ = require('underscore'),
    controllerUtils = require('../../util/controller-utils'),
    dice = require('../../model/dice'),
    diceExpressionResultUtils = require('../../model/dice-expression-result-utils'),
    httpStatus = require('http-status-codes'),
    random = require('../../util/random'),
    security = require('../../util/security');

module.exports = {
    create: function (controllerData) {
        function createRandomNumberGenerator(randomNumberGeneratorSpecification) {
            switch (randomNumberGeneratorSpecification.name) {
                case 'constantMax':
                    return random.constantMax();

                case 'uniform':
                    return random.uniform(randomNumberGeneratorSpecification.options);
            }

            throw controllerUtils.createControllerError(
                httpStatus.BAD_REQUEST,
                'unknown random number generator "' + randomNumberGeneratorSpecification.name + '"'
            );
        }

        function createResponseBody(request) {
            var expression,
                expressionResult,
                randomNumberGeneratorSpecification,
                requestBody = request.body,
                responseBody = {};

            randomNumberGeneratorSpecification = getRandomNumberGeneratorSpecification(requestBody);
            responseBody.randomNumberGenerator = randomNumberGeneratorSpecification;

            expression = parseExpressionText(requestBody.expression.text, randomNumberGeneratorSpecification);
            responseBody.expression = {
                canonicalText: formatExpression(expression),
                text: requestBody.expression.text
            };

            expressionResult = expression.evaluate();
            if (!_.isFinite(expressionResult.value)) {
                throw controllerUtils.createControllerError(
                    httpStatus.BAD_REQUEST,
                    'expression does not evaluate to a finite number'
                );
            }
            responseBody.expressionResult = {
                text: formatExpressionResult(expressionResult),
                value: expressionResult.value
            };

            responseBody.dieRollResults = enumerateDieRollResults(expressionResult);

            return responseBody;
        }

        function enumerateDieRollResults(expressionResult) {
            return diceExpressionResultUtils.enumerateDieRollResults(expressionResult);
        }

        function formatExpression(expression) {
            return dice.expressionFormatter.format(expression);
        }

        function formatExpressionResult(expressionResult) {
            return dice.expressionResultFormatter.format(expressionResult);
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
            var expressionParser,
                expressionParserContext;

            expressionParserContext = dice.expressionParser.createDefaultContext();
            expressionParserContext.bag = dice.bag.create(createRandomNumberGenerator(randomNumberGeneratorSpecification));
            expressionParser = dice.expressionParser.create(expressionParserContext);
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
