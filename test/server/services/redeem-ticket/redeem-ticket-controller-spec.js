/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const controllerTest = require('../../test-support/controller-test');
const httpStatus = require('http-status-codes');
const ja = require('json-assert');

describe('redeemTicketController', () => {
    let controller;
    let request;
    let response;
    let responseBody;

    function createRedeemTicketController(evaluateExpressionController) {
        evaluateExpressionController = evaluateExpressionController || require('../../../../src/server/services/evaluate-expression/evaluate-expression-controller').create({
            publicKey: controllerTest.getPublicKey(),
        });
        return require('../../../../src/server/services/redeem-ticket/redeem-ticket-controller').create({
            evaluateExpressionController: evaluateExpressionController,
            privateKey: controllerTest.getPrivateKey(),
            publicKey: controllerTest.getPublicKey(),
            validateRedeemedTicketPath: '/validateRedeemedTicketPath',
        });
    }

    function modifyRequestBody(callback) {
        modifyRequestBodyWithoutSignatureUpdate(callback);

        const randomNumberGenerator = request.body.ticket.content.evaluateExpressionRequestBody.randomNumberGenerator;
        randomNumberGenerator.signature = controllerTest.createSignature(randomNumberGenerator.content);

        const ticket = request.body.ticket;
        ticket.signature = controllerTest.createSignature(ticket.content);
    }

    function modifyRequestBodyWithoutSignatureUpdate(callback) {
        callback();
    }

    beforeEach(() => {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = controllerTest.createRequest();
        modifyRequestBody(() => {
            request.body = {
                ticket: {
                    content: {
                        description: 'description',
                        evaluateExpressionRequestBody: {
                            expression: {
                                text: '3d6+4',
                            },
                            randomNumberGenerator: {
                                content: {
                                    name: 'constantMax',
                                },
                                signature: null,
                            },
                        },
                        id: '00112233445566778899aabbccddeeff00112233',
                        redeemUrl: 'http://host:1234/redeemTicketPath',
                    },
                    signature: null,
                },
            };
        });

        response = controllerTest.createResponse((json) => {
            responseBody = json;
        });
        responseBody = null;

        controller = createRedeemTicketController();
    });

    describe('.redeemTicket', () => {
        describe('when evaluate expression controller responds with success', () => {
            it('should respond with OK', () => {
                controller.redeemTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    redeemedTicket: {
                        content: {
                            description: 'description',
                            evaluateExpressionResponseBody: {
                                dieRollResults: [
                                    {
                                        sides: 6,
                                        value: 6,
                                    },
                                    {
                                        sides: 6,
                                        value: 6,
                                    },
                                    {
                                        sides: 6,
                                        value: 6,
                                    },
                                ],
                                expression: {
                                    canonicalText: 'sum(roll(3, d6)) + 4',
                                    text: '3d6+4',
                                },
                                expressionResult: {
                                    text: '[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4',
                                    value: 22,
                                },
                                randomNumberGenerator: {
                                    name: 'constantMax',
                                },
                            },
                            id: '00112233445566778899aabbccddeeff00112233',
                            validateUrl: ja.matchType('string'),
                        },
                        signature: ja.matchType('object'),
                    },
                });
            });

            it('should respond with a signed redeemed ticket', () => {
                controller.redeemTicket(request, response);

                expect(responseBody.redeemedTicket).toBeSigned();
            });
        });

        describe('when evaluate expression controller responds with error', () => {
            it('should respond with same error', () => {
                const expectedStatus = httpStatus.BAD_GATEWAY;
                const expectedErrorMessage = 'message';
                const stubEvaluateExpressionController = {
                    evaluateExpression(request, response) {
                        response.status(expectedStatus).json({
                            error: {
                                message: expectedErrorMessage,
                            },
                        });
                    },
                };

                controller = createRedeemTicketController(stubEvaluateExpressionController);

                controller.redeemTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(expectedStatus);
                expect(responseBody).toEqual({
                    error: {
                        message: expectedErrorMessage,
                    },
                });
            });
        });

        describe('when ticket has an invalid signature', () => {
            it('should respond with bad request error', () => {
                modifyRequestBodyWithoutSignatureUpdate(() => {
                    request.body.ticket.content.description += '...'; // simulate forged content
                });

                controller.redeemTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                expect(responseBody).toEqual({
                    error: {
                        message: ja.matchType('string'),
                    },
                });
            });
        });

        describe('when ticket has already been redeemed', () => {
            it('should respond with same result as previous redemption', () => {
                modifyRequestBody(() => {
                    request.body = {
                        ticket: {
                            content: {
                                description: 'description',
                                evaluateExpressionRequestBody: {
                                    expression: {
                                        text: '3d6+4',
                                    },
                                    randomNumberGenerator: {
                                        content: {
                                            name: 'uniform',
                                            options: {
                                                seed: [1, 2, 3],
                                            },
                                        },
                                        signature: null,
                                    },
                                },
                                id: '00112233445566778899aabbccddeeff00112233',
                                redeemUrl: 'http://host:1234/redeemTicketPath',
                            },
                            signature: null,
                        },
                    };
                });
                controller.redeemTicket(request, response);
                const firstResponseBody = responseBody;
                responseBody = null;

                controller.redeemTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual(firstResponseBody);
            });
        });
    });
});
