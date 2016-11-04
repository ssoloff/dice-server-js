/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const controllerTest = require('../test-support/controller-test');
const controllerUtils = require('../../../src/server/util/controller-utils');
const httpStatus = require('http-status-codes');

describe('controllerUtils', function () {
    describe('.createControllerErrorFromResponse', function () {
        describe('when response body does not contain an error', function () {
            it('should create error with empty message', function () {
                const e = controllerUtils.createControllerErrorFromResponse(httpStatus.INTERNAL_SERVER_ERROR, {});

                expect(e.message).toBe('');
            });
        });
    });

    describe('.setFailureResponse', function () {
        describe('when error is not an instance of ControllerError', function () {
            it('should set response status to internal server error', function () {
                const response = controllerTest.createResponse(function () {
                });

                controllerUtils.setFailureResponse(response, new Error('message'));

                expect(response.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    });
});
