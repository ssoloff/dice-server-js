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

describe('enumerateDiceController', function () {
    var controller,
        request,
        response,
        responseBody;

    function createEnumerateDiceController() {
        return require('../../../app/controllers/enumerate-dice-controller').create();
    }

    beforeEach(function () {
        jasmine.addCustomEqualityTester(controllerTest.isResponseBodyEqual);

        request = controllerTest.createRequest();
        request.body = {
            expression: {
                text: null
            }
        };

        response = controllerTest.createResponse(function (json) {
            responseBody = json;
        });
        responseBody = null;

        controller = createEnumerateDiceController();
    });

    describe('.enumerateDice', function () {
        describe('when expression is well-formed', function () {
            beforeEach(function () {
                request.body.expression.text = '3d8+4';
            });

            it('should respond with OK', function () {
                controller.enumerateDice(request, response);

                expect(response.status).toHaveBeenCalledWith(httpStatus.OK);
                expect(responseBody).toEqual({
                    expression: {
                        canonicalText: 'sum(roll(3, d8)) + 4',
                        text: '3d8+4'
                    },
                    dice: [8, 8, 8]
                });
            });
        });

        describe('when expression is malformed', function () {
            beforeEach(function () {
                request.body.expression.text = '<<INVALID>>';
            });

            it('should respond with bad request error', function () {
                controller.enumerateDice(request, response);

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
