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
var issueTicketController = require('../../controllers/issue-ticket-controller');
var ja = require('json-assert');

describe('issueTicketController', function () {
    var req;
    var res;
    var request;
    var response;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseContentEqual);

        request = {
            description: 'description',
            evaluateRequest: {
                expression: {
                    text: '3d6+4'
                },
                randomNumberGenerator: {
                    name: 'constantMax'
                }
            }
        };
        req = controllerTest.createRequest(request);

        response = null;
        res = controllerTest.createResponse(function (json) {
            response = json;
        });

        controllerTest.setKeys(issueTicketController);
        issueTicketController.setEvaluateController(); // reset default controller
    });

    describe('.issueTicket', function () {
        describe('when evaluate controller responds with success', function () {
            it('should respond with success', function () {
                issueTicketController.issueTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    success: {
                        description: 'description',
                        evaluateRequest: {
                            expression: {
                                text: '3d6+4'
                            },
                            randomNumberGenerator: {
                                name: 'constantMax'
                            }
                        },
                        id: ja.matchType('string')
                    }
                });
            });

            it('should respond with a valid ticket identifier', function () {
                issueTicketController.issueTicket(req, res);

                expect(response.content.success.id).toMatch(/^[0-9A-Fa-f]{40}$/);
            });

            it('should respond with a signature', function () {
                issueTicketController.issueTicket(req, res);

                expect(response).toBeSigned();
            });
        });

        describe('when evaluate controller responds with failure', function () {
            beforeEach(function () {
                request.evaluateRequest.expression.text = '<<INVALID>>';
            });

            it('should respond with failure', function () {
                issueTicketController.issueTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });

            it('should respond with a signature', function () {
                issueTicketController.issueTicket(req, res);

                expect(response).toBeSigned();
            });
        });

        describe('when evaluate controller responds with non-OK status', function () {
            beforeEach(function () {
                var stubEvaluateController = {
                    evaluate: function (req, res) {
                        res.status(500).json({});
                    }
                };
                issueTicketController.setEvaluateController(stubEvaluateController);
            });

            it('should respond with failure', function () {
                issueTicketController.issueTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });

            it('should respond with a signature', function () {
                issueTicketController.issueTicket(req, res);

                expect(response).toBeSigned();
            });
        });
    });
});

