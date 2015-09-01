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
var fs = require('fs');
var ja = require('json-assert');
var path = require('path');
var redeemTicketController = require('../../controllers/redeem-ticket-controller');

describe('redeemTicketController', function () {
    var req;
    var res;
    var request;
    var response;

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseContentEqual);

        request = {
            description: 'description',
            expression: {
                text: '3d6+4'
            },
            id: '00112233445566778899aabbccddeeff00112233',
            randomNumberGenerator: {
                name: 'constantMax'
            }
        };
        req = {
            body: request
        };

        response = null;
        res = {
            json: function (json) {
                response = json;
                return this;
            },
            status: function () {
                return this;
            }
        };
        spyOn(res, 'json').and.callThrough();
        spyOn(res, 'status').and.callThrough();

        redeemTicketController.setKeys(
            fs.readFileSync(path.join(__dirname, '../../test/private-key.pem')),
            fs.readFileSync(path.join(__dirname, '../../test/public-key.pem'))
        );
    });

    describe('.redeemTicket', function () {
        describe('when expression is well-formed', function () {
            it('should respond with success', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    success: {
                        description: 'description',
                        expression: {
                            canonicalText: 'sum(roll(3, d6)) + 4',
                            text: '3d6+4'
                        },
                        expressionResult: {
                            text: '[sum([roll(3, d6) -> [6, 6, 6]]) -> 18] + 4',
                            value: 22
                        },
                        id: '00112233445566778899aabbccddeeff00112233',
                        randomNumberGenerator: {
                            name: 'constantMax'
                        }
                    }
                });
            });

            it('should respond with a signature', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(response).toBeSigned();
            });
        });

        describe('when expression is malformed', function () {
            beforeEach(function () {
                request.expression.text = '<<INVALID>>';
            });

            it('should respond with failure', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });

            it('should respond with a signature', function () {
                redeemTicketController.redeemTicket(req, res);

                expect(response).toBeSigned();
            });
        });
    });
});

