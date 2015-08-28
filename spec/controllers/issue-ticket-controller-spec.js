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

var _ = require('underscore');
var issueTicketController = require('../../controllers/issue-ticket-controller');
var fs = require('fs');
var ja = require('json-assert');
var path = require('path');

describe('issueTicketController', function () {
    var req;
    var res;
    var request;
    var response;

    function isJsonEqual(actual, expected) {
        if ((_.has(actual, 'success') || _.has(actual, 'failure')) &&
                (_.has(expected, 'success') || _.has(expected, 'failure'))) {
            return ja.isEqual(expected, actual, true);
        }
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(isJsonEqual);

        request = {
            description: 'description',
            expression: {
                text: '3d6+4'
            }
        };
        req = {
            body: request
        };

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

        issueTicketController.setKeys(
            fs.readFileSync(path.join(__dirname, '../../test/private-key.pem')),
            fs.readFileSync(path.join(__dirname, '../../test/public-key.pem'))
        );
    });

    describe('.issueTicket', function () {
        describe('when expression is well-formed', function () {
            it('should respond with success', function () {
                issueTicketController.issueTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    success: {
                        description: 'description',
                        expression: {
                            text: '3d6+4'
                        },
                        id: ja.matchType('string')
                    }
                });
            });

            it('should respond with a valid ticket identifier', function () {
                issueTicketController.issueTicket(req, res);

                expect(response.content.success.id).toMatch(/^[0-9A-Fa-f]{40}$/);
            });
        });

        describe('when expression is malformed', function () {
            it('should respond with failure', function () {
                request.expression.text = '<<INVALID>>';

                issueTicketController.issueTicket(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(response.content).toEqual({
                    failure: {
                        message: ja.matchType('string')
                    }
                });
            });
        });
    });
});

