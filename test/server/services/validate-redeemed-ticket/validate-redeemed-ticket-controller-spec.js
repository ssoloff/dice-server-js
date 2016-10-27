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

describe('validateRedeemedTicketController', function () {
    var controller,
        request,
        response,
        responseBody;

    function createValidateRedeemedTicketController() {
        return require('../../../../src/server/services/validate-redeemed-ticket/validate-redeemed-ticket-controller').create({
            publicKey: controllerTest.getPublicKey()
        });
    }

    function modifyRequestBody(callback) {
        var redeemedTicket;

        modifyRequestBodyWithoutSignatureUpdate(callback);

        redeemedTicket = request.body.redeemedTicket;
        redeemedTicket.signature = controllerTest.createSignature(redeemedTicket.content);
    }

    function modifyRequestBodyWithoutSignatureUpdate(callback) {
        callback();
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = controllerTest.createRequest();
        modifyRequestBody(function () {
            request.body = {
                redeemedTicket: {
                    content: {
                        description: 'description',
                        evaluateExpressionResponseBody: {
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
                        },
                        id: '00112233445566778899aabbccddeeff00112233',
                        validateUrl: 'http://host:1234/validateRedeemedTicketPath'
                    },
                    signature: null
                }
            };
        });

        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });
        responseBody = null;

        controller = createValidateRedeemedTicketController();
    });

    describe('.validateRedeemedTicket', function () {
        describe('when redeemed ticket is valid', function () {
            it('should respond with OK', function () {
                controller.validateRedeemedTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({});
            });
        });

        describe('when redeemed ticket has an invalid signature', function () {
            it('should respond with bad request error', function () {
                modifyRequestBodyWithoutSignatureUpdate(function () {
                    request.body.redeemedTicket.content.description += '...'; // simulate forged content
                });

                controller.validateRedeemedTicket(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
                expect(responseBody).toEqual({
                    error: {
                        message: ja.matchType('string')
                    }
                });
            });
        });
    });
});
