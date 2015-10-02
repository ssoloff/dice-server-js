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

var controllerTest = require('./controller-test');
var httpStatus = require('http-status-codes');
var ja = require('json-assert');

describe('evaluateExpressionController', function () {
    var controller;
    var request;
    var response;
    var requestBody;
    var responseBody;

    function createEvaluateExpressionController() {
        return require('../../controllers/evaluate-expression-controller').create();
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        requestBody = {
            expression: {
                text: '3d6+4'
            },
            randomNumberGenerator: {
                name: 'constantMax'
            }
        };
        request = controllerTest.createRequest(requestBody);

        responseBody = null;
        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });

        controller = createEvaluateExpressionController();
    });

    describe('.evaluateExpression', function () {
        describe('when expression is well-formed', function () {
            it('should respond with the expression result', function () {
                controller.evaluateExpression(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    success: {
                        expression: {
                            canonicalText: 'sum(roll(3, d6)) + 4',
                            text: '3d6+4'
                        },
                        expressionResult: {
                            text: '[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4',
                            value: 22
                        },
                        randomNumberGenerator: {
                            name: 'constantMax'
                        }
                    }
                });
            });
        });

        describe('when expression is malformed', function () {
            beforeEach(function () {
                requestBody.expression.text = '<<INVALID>>';
            });

            it('should respond with an error', function () {
                controller.evaluateExpression(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('specifying a random number generator', function () {
            describe('when the random number generator is not specified', function () {
                it('should use the default random number generator', function () {
                    delete requestBody.randomNumberGenerator;

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.success.randomNumberGenerator.name).toBe('uniform');
                });
            });

            describe('when the uniform random number generator is specified', function () {
                it('should use the uniform random number generator', function () {
                    requestBody.randomNumberGenerator.name = 'uniform';

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.success.randomNumberGenerator.name).toBe('uniform');
                    expect(responseBody.success.expressionResult.value).toBeGreaterThan(2 + 4);
                    expect(responseBody.success.expressionResult.value).toBeLessThan(19 + 4);
                });
            });

            describe('when the constantMax random number generator is specified', function () {
                it('should use the constantMax random number generator', function () {
                    requestBody.randomNumberGenerator.name = 'constantMax';

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.success.randomNumberGenerator.name).toBe('constantMax');
                    expect(responseBody.success.expressionResult.value).toBe(22);
                });
            });

            describe('when an unknown random number generator is specified', function () {
                it('should respond with an error', function () {
                    requestBody.randomNumberGenerator.name = '<<UNKNOWN>>';

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.failure).toBeDefined();
                });
            });
        });

        describe('evaluating an expression whose result value is not a finite number', function () {
            describe('when result value is not a number', function () {
                it('should respond with an error', function () {
                    requestBody.expression.text = 'd6';

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.failure).toBeDefined();
                });
            });

            describe('when result value is NaN', function () {
                it('should respond with an error', function () {
                    requestBody.expression.text = 'round(d6)';

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.failure).toBeDefined();
                });
            });
        });
    });
});

