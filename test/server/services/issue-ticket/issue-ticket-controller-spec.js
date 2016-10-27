/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var controllerTest = require('../../test-support/controller-test'),
    httpStatus = require('http-status-codes'),
    ja = require('json-assert');

describe('issueTicketController', function () {
    var controller,
        request,
        response,
        responseBody;

    function createIssueTicketController(evaluateExpressionController) {
        evaluateExpressionController = evaluateExpressionController || require('../../../../src/server/services/evaluate-expression/evaluate-expression-controller').create({
            publicKey: controllerTest.getPublicKey()
        });
        return require('../../../../src/server/services/issue-ticket/issue-ticket-controller').create({
            evaluateExpressionController: evaluateExpressionController,
            privateKey: controllerTest.getPrivateKey(),
            publicKey: controllerTest.getPublicKey(),
            redeemTicketPath: '/redeemTicketPath'
        });
    }

    function modifyRequestBody(callback) {
        var randomNumberGenerator;

        callback();

        randomNumberGenerator = request.body.evaluateExpressionRequestBody.randomNumberGenerator;
        if (randomNumberGenerator) {
            randomNumberGenerator.signature = controllerTest.createSignature(randomNumberGenerator.content);
        }
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = controllerTest.createRequest();
        modifyRequestBody(function () {
            request.body = {
                description: 'description',
                evaluateExpressionRequestBody: {
                    expression: {
                        text: '3d6+4'
                    },
                    randomNumberGenerator: {
                        content: {
                            name: 'constantMax'
                        },
                        signature: null
                    }
                }
            };
        });

        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });
        responseBody = null;

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
                                    content: {
                                        name: 'constantMax'
                                    },
                                    signature: ja.matchType('object')
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
                var expectedStatus = httpStatus.BAD_GATEWAY,
                    expectedErrorMessage = 'message',
                    stubEvaluateExpressionController = {
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

        describe('when random number generator specification is not provided', function () {
            it('should use uniform random number generator with seed', function () {
                modifyRequestBody(function () {
                    request.body = {
                        description: 'description',
                        evaluateExpressionRequestBody: {
                            expression: {
                                text: '3d6+4'
                            }
                        }
                    };
                });

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
                                    content: {
                                        name: 'uniform',
                                        options: {
                                            seed: ja.matchType('object')
                                        }
                                    },
                                    signature: ja.matchType('object')
                                }
                            },
                            id: ja.matchType('string'),
                            redeemUrl: ja.matchType('string')
                        },
                        signature: ja.matchType('object')
                    }
                });
            });
        });
    });
});
