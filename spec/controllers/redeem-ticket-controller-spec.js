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
var ja = require('json-assert');
var redeemTicketController = require('../../controllers/redeem-ticket-controller');

describe('redeemTicketController', function () {
    var req;
    var res;
    var request;
    var response;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseContentEqual);

        request = {
            ticket: {
                content: {
                    description: 'description',
                    evaluateRequest: {
                        expression: {
                            text: '3d6+4'
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
        request.ticket.signature = controllerTest.createSignature(request.ticket.content);
        req = controllerTest.createRequest(request);

        response = null;
        res = controllerTest.createResponse(function (json) {
            response = json;
        });

        controllerTest.setKeys(redeemTicketController);
        redeemTicketController.clearRedeemedTickets();
        redeemTicketController.setEvaluateController(); // reset default evaluate controller
    });

    describe('.redeemTicket', function () {
        describe('when evaluate controller responds with success', function () {
            it('should respond with success', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    success: {
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
                            signature: ja.matchType('object')
                        }
                    }
                });
            });

            it('should respond with a signed redeemed ticket', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(response.success.redeemedTicket).toBeSigned();
            });
        });

        describe('when evaluate controller responds with failure', function () {
            it('should respond with failure', function () {
                request.ticket.content.evaluateRequest.expression.text = '<<INVALID>>';
                request.ticket.signature = controllerTest.createSignature(request.ticket.content);

                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('when evaluate controller responds with non-OK status', function () {
            it('should respond with failure', function () {
                var stubEvaluateController = {
                    evaluate: function (req, res) {
                        res.status(500).json({});
                    }
                };
                redeemTicketController.setEvaluateController(stubEvaluateController);

                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('when ticket has an invalid signature', function () {
            it('should respond with failure', function () {
                request.ticket.content.description += '...'; // simulate forged content

                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });

        describe('when ticket has already been redeemed', function () {
            it('should respond with failure', function () {
                redeemTicketController.redeemTicket(req, res);
                expect(response.success).toBeDefined(); // sanity check
                response = null;

                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });
    });
});

