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

var controllerTest = require('./test-support/controller-test');
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
        return require('../../controllers/issue-ticket-controller').create({
            evaluateExpressionController: evaluateExpressionController,
            privateKey: controllerTest.getPrivateKey(),
            publicKey: controllerTest.getPublicKey(),
            redeemTicketPath: '/redeemTicketPath'
        });
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        requestBody = {
            description: 'description',
            evaluateExpressionRequestBody: {
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
            it('should respond with OK', function () {
                controller.issueTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    ticket: {
                        content: {
                            description: 'description',
                            evaluateExpressionRequestBody: {
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
                });
            });

            it('should respond with a valid ticket', function () {
                controller.issueTicket(request, response);

                expect(responseBody.ticket.content.id).toMatch(/^[0-9A-Fa-f]{40}$/);
            });

            it('should respond with a signed ticket', function () {
                controller.issueTicket(request, response);

                expect(responseBody.ticket).toBeSigned();
            });
        });

        describe('when evaluate expression controller responds with error', function () {
            it('should respond with same error', function () {
                var expectedStatus = httpStatus.BAD_GATEWAY;
                var expectedErrorMessage = 'message';
                var stubEvaluateExpressionController = {
                    evaluateExpression: function (request, response) {
                        response.status(expectedStatus).json({
                            error: {
                                message: expectedErrorMessage
                            }
                        });
                    }
                };
                controller = createIssueTicketController(stubEvaluateExpressionController);

                controller.issueTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(expectedStatus);
                expect(responseBody).toEqual({
                    error: {
                        message: expectedErrorMessage
                    }
                });
            });
        });
    });
});

