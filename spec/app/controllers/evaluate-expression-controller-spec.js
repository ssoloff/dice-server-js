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

var controllerTest = require('./test-support/controller-test');
var fs = require('fs');
var httpStatus = require('http-status-codes');
var ja = require('json-assert');
var path = require('path');
var security = require('../../../app/controllers/support/security');

describe('evaluateExpressionController', function () {
    var controller,
        request,
        response,
        responseBody;

    function createEvaluateExpressionController() {
        return require('../../../app/controllers/evaluate-expression-controller').create({
            publicKey: controllerTest.getPublicKey()
        });
    }

    function modifyRequestBody(callback) {
        var randomNumberGenerator;

        callback();

        randomNumberGenerator = request.body.randomNumberGenerator;
        if (randomNumberGenerator) {
            randomNumberGenerator.signature = controllerTest.createSignature(randomNumberGenerator.content);
        }
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = controllerTest.createRequest();
        modifyRequestBody(function () {
            request.body = {
                expression: {
                    text: '3d6+4'
                },
                randomNumberGenerator: {
                    content: {
                        name: 'constantMax'
                    },
                    signature: null
                }
            };
        });

        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });
        responseBody = null;

        controller = createEvaluateExpressionController();
    });

    describe('.evaluateExpression', function () {
        describe('when expression is well-formed', function () {
            it('should respond with OK', function () {
                controller.evaluateExpression(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    dieRollResults: [
                        {
                            sides: 6,
                            value: 6
                        },
                        {
                            sides: 6,
                            value: 6
                        },
                        {
                            sides: 6,
                            value: 6
                        }
                    ],
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
                });
            });
        });

        describe('when expression is malformed', function () {
            beforeEach(function () {
                modifyRequestBody(function () {
                    request.body.expression.text = '<<INVALID>>';
                });
            });

            it('should respond with bad request error', function () {
                controller.evaluateExpression(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                expect(responseBody).toEqual({
                    error: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('specifying a random number generator', function () {
            describe('when the random number generator is not specified', function () {
                it('should use the default random number generator', function () {
                    modifyRequestBody(function () {
                        delete request.body.randomNumberGenerator;
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.randomNumberGenerator.name).toBe('uniform');
                });
            });

            describe('when the uniform random number generator is specified', function () {
                it('should use the uniform random number generator', function () {
                    modifyRequestBody(function () {
                        request.body.randomNumberGenerator.content.name = 'uniform';
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.randomNumberGenerator.name).toBe('uniform');
                    expect(responseBody.expressionResult.value).toBeGreaterThan(2 + 4);
                    expect(responseBody.expressionResult.value).toBeLessThan(19 + 4);
                });
            });

            describe('when the constantMax random number generator is specified', function () {
                it('should use the constantMax random number generator', function () {
                    modifyRequestBody(function () {
                        request.body.randomNumberGenerator.content.name = 'constantMax';
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                    expect(responseBody.randomNumberGenerator.name).toBe('constantMax');
                    expect(responseBody.expressionResult.value).toBe(22);
                });
            });

            describe('when an unknown random number generator is specified', function () {
                it('should respond with bad request error', function () {
                    modifyRequestBody(function () {
                        request.body.randomNumberGenerator.content.name = '<<UNKNOWN>>';
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                    expect(responseBody.error).toBeDefined();
                });
            });

            describe('when random number generator specification has an invalid signature', function () {
                it('should respond with bad request error', function () {
                    var otherPrivateKey = fs.readFileSync(path.join(__dirname, '../../../test/other-private-key.pem')),
                        otherPublicKey = fs.readFileSync(path.join(__dirname, '../../../test/other-public-key.pem'));

                    request.body.randomNumberGenerator.signature = security.createSignature(
                        request.body.randomNumberGenerator.content,
                        otherPrivateKey, // sign using unauthorized key
                        otherPublicKey
                    );

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                    expect(responseBody.error).toBeDefined();
                });
            });
        });

        describe('evaluating an expression whose result value is not a finite number', function () {
            describe('when result value is not a number', function () {
                it('should respond with bad request error', function () {
                    modifyRequestBody(function () {
                        request.body.expression.text = 'd6';
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                    expect(responseBody.error).toBeDefined();
                });
            });

            describe('when result value is NaN', function () {
                it('should respond with bad request error', function () {
                    modifyRequestBody(function () {
                        request.body.expression.text = 'round(d6)';
                    });

                    controller.evaluateExpression(request, response);

                    expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                    expect(responseBody.error).toBeDefined();
                });
            });
        });
    });
});
