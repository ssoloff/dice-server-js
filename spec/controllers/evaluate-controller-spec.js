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
var evaluateController = require('../../controllers/evaluate-controller');
var ja = require('json-assert');

describe('evaluateController', function () {
    var req;
    var res;
    var request;
    var response;

    function isJsonEqual(actual, expected) {
        if ((_.has(actual, 'expression') || _.has(actual, 'error'))
                && (_.has(expected, 'expression') || _.has(expected, 'error'))) {
            return ja.isEqual(expected, actual, true);
        }
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(isJsonEqual);

        request = {
            expression: {
                text: '3d6+4'
            },
            randomNumberGenerator: {
                name: 'constantMax'
            }
        };
        req = {
            body: request
        };

        res = {
            json: function (json) {
                response = json;
                return this;
            },
            status: function () {
                return this;
            }
        };
        spyOn(res, 'json').and.callThrough();
        spyOn(res, 'status').and.callThrough();
    });

    describe('.evaluate', function () {
        describe('when expression is well-formed', function () {
            it('should respond with the expression result', function () {
                evaluateController.evaluate(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    expression: {
                        canonicalText: 'sum(roll(3, d6)) + 4',
                        text: '3d6+4'
                    },
                    expressionResult: {
                        text: '[sum([roll(3, d6) -> 6,6,6]) -> 18] + 4',
                        value: 22
                    },
                    randomNumberGenerator: {
                        name: 'constantMax'
                    }
                });
            });
        });

        describe('when expression is malformed', function () {
            it('should respond with an error', function () {
                request.expression.text = '<<INVALID>>';

                evaluateController.evaluate(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    error: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('specifying a random number generator', function () {
            describe('when the random number generator is not specified', function () {
                it('should use the default random number generator', function () {
                    delete request.randomNumberGenerator;

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.randomNumberGenerator.name).toBe('uniform');
                });
            });

            describe('when the uniform random number generator is specified', function () {
                it('should use the uniform random number generator', function () {
                    request.randomNumberGenerator.name = 'uniform';

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.randomNumberGenerator.name).toBe('uniform');
                    expect(response.expressionResult.value).toBeGreaterThan(2 + 4);
                    expect(response.expressionResult.value).toBeLessThan(19 + 4);
                });
            });

            describe('when the constantMax random number generator is specified', function () {
                it('should use the constantMax random number generator', function () {
                    request.randomNumberGenerator.name = 'constantMax';

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.randomNumberGenerator.name).toBe('constantMax');
                    expect(response.expressionResult.value).toBe(22);
                });
            });

            describe('when an unknown random number generator is specified', function () {
                it('should respond with an error', function () {
                    request.randomNumberGenerator.name = '<<UNKNOWN>>';

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.error).toBeDefined();
                });
            });
        });

        describe('evaluating an expression whose result value is not a finite number', function () {
            describe('when result value is not a number', function () {
                it('should respond with an error', function () {
                    request.expression.text = 'd6';

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.error).toBeDefined();
                });
            });

            describe('when result value is NaN', function () {
                it('should respond with an error', function () {
                    request.expression.text = 'round(d6)';

                    evaluateController.evaluate(req, res);

                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(response.error).toBeDefined();
                });
            });
        });
    });
});

