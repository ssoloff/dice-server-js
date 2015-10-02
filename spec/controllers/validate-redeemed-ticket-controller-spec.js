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

describe('validateRedeemedTicketController', function () {
    var controller;
    var req;
    var res;
    var request;
    var response;

    function createValidateRedeemedTicketController() {
        return require('../../controllers/validate-redeemed-ticket-controller').create(
            controllerTest.getPublicKey()
        );
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = {
            redeemedTicket: {
                content: {
                    description: 'description',
                    evaluateResponse: {
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
                    id: '00112233445566778899aabbccddeeff00112233'
                },
                signature: null
            }
        };
        request.redeemedTicket.signature = controllerTest.createSignature(request.redeemedTicket.content);
        req = controllerTest.createRequest(request);

        response = null;
        res = controllerTest.createResponse(function (json) {
            response = json;
        });

        controller = createValidateRedeemedTicketController();
    });

    describe('.validateRedeemedTicket', function () {
        describe('when redeemed ticket is valid', function () {
            it('should respond with success', function () {
                controller.validateRedeemedTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(response).toEqual({
                    success: {}
                });
            });
        });

        describe('when redeemed ticket has an invalid signature', function () {
            it('should respond with failure', function () {
                request.redeemedTicket.content.description += '...'; // simulate forged content

                controller.validateRedeemedTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(response).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });
    });
});

