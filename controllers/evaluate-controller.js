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

"use strict";

var dice = require("../lib/dice");
var numberUtils = require("../lib/number-utils");

function createRandomNumberGenerator(randomNumberGeneratorSpecification) {
    switch (randomNumberGeneratorSpecification.name) {
        case "constantMax":
            return function () {
                return 1.0 - numberUtils.EPSILON;
            };

        case "uniform":
            return Math.random;
    }

    throw new Error("unknown random number generator '" + randomNumberGeneratorSpecification.name + "'");
}

function getRandomNumberGeneratorSpecification(request) {
    return request.randomNumberGenerator || {name: "uniform"};
}

module.exports = {
    evaluate: function (req, res) {
        var request = req.body;
        var response = {};

        try {
            var randomNumberGeneratorSpecification = getRandomNumberGeneratorSpecification(request);
            dice.expressionParser.setBag(new dice.Bag(createRandomNumberGenerator(randomNumberGeneratorSpecification)));

            var expression = dice.expressionParser.parse(request.expression);
            response.expression = {
                text: dice.expressionFormatter.format(expression)
            };

            response.randomNumberGenerator = randomNumberGeneratorSpecification;

            var expressionResult = expression.evaluate();
            response.expressionResult = {
                text: dice.expressionResultFormatter.format(expressionResult),
                value: expressionResult.value()
            };
        }
        catch (e) {
            response.error = {
                message: (e instanceof Error) ? e.message : e.toString()
            };
        }

        res.status(200).json(response);
    }
};

