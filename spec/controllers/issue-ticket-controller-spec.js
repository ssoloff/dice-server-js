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

describe('issueTicketController', function () {
    var controller;
    var request;
    var response;
    var requestBody;
    var responseBody;

    function createIssueTicketController(evaluateExpressionController) {
        evaluateExpressionController = evaluateExpressionController || require('../../controllers/evaluate-expression-controller').create();
        return require('../../controllers/issue-ticket-controller').create(
            controllerTest.getPrivateKey(),
            controllerTest.getPublicKey(),
            evaluateExpressionController,
            '/redeemTicketPath'
        );
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseContentEqual);

        requestBody = {
            description: 'description',
            evaluateExpressionRequest: {
                expression: {
                    text: '3d6+4'
                },
                randomNumberGenerator: {
                    name: 'constantMax'
                }
            }
        };
        request = controllerTest.createRequest(requestBody);

        responseBody = null;
        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });

        controller = createIssueTicketController();
    });

    describe('.issueTicket', function () {
        describe('when evaluate expression controller responds with success', function () {
            it('should respond with success', function () {
                controller.issueTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    success: {
                        ticket: {
                            content: {
                                description: 'description',
                                evaluateExpressionRequest: {
                                    expression: {
                                        text: '3d6+4'
                                    },
                                    randomNumberGenerator: {
                                        name: 'constantMax'
                                    }
                                },
                                id: ja.matchType('string'),
                                redeemUrl: ja.matchType('string')
                            },
                            signature: ja.matchType('object')
                        }
                    }
                });
            });

            it('should respond with a valid ticket', function () {
                controller.issueTicket(request, response);

                expect(responseBody.success.ticket.content.id).toMatch(/^[0-9A-Fa-f]{40}$/);
            });

            it('should respond with a signed ticket', function () {
                controller.issueTicket(request, response);

                expect(responseBody.success.ticket).toBeSigned();
            });
        });

        describe('when evaluate expression controller responds with failure', function () {
            it('should respond with failure', function () {
                requestBody.evaluateExpressionRequest.expression.text = '<<INVALID>>';

                controller.issueTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('when evaluate expression controller responds with non-OK status', function () {
            it('should respond with failure', function () {
                var stubEvaluateExpressionController = {
                    evaluateExpression: function (request, response) {
                        response.status(500).json({});
                    }
                };
                controller = createIssueTicketController(stubEvaluateExpressionController);

                controller.issueTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });
    });
});

