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
var httpStatus = require('http-status-codes');
var ja = require('json-assert');

describe('validateRedeemedTicketController', function () {
    var controller,
        request,
        response,
        responseBody;

    function createValidateRedeemedTicketController() {
        return require('../../../app/controllers/validate-redeemed-ticket-controller').create({
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
