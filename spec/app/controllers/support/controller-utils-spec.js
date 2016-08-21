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

var controllerTest = require('../test-support/controller-test');
var controllerUtils = require('../../../../app/controllers/support/controller-utils');
var httpStatus = require('http-status-codes');

describe('controllerUtils', function () {
    describe('.createControllerErrorFromResponse', function () {
        describe('when response body does not contain an error', function () {
            it('should create error with empty message', function () {
                var e = controllerUtils.createControllerErrorFromResponse(httpStatus.INTERNAL_SERVER_ERROR, {});

                expect(e.message).toBe('');
            });
        });
    });

    describe('.setFailureResponse', function () {
        describe('when error is not an instance of ControllerError', function () {
            it('should set response status to internal server error', function () {
                var response = controllerTest.createResponse(function () {
                });

                controllerUtils.setFailureResponse(response, new Error('message'));

                expect(response.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });
});
