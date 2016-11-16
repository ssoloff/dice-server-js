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

describe('controllerUtils', () => {
  describe('.createControllerErrorFromResponse', () => {
    describe('when response body does not contain an error', () => {
      it('should create error with empty message', () => {
        const e = controllerUtils.createControllerErrorFromResponse(httpStatus.INTERNAL_SERVER_ERROR, {});

        expect(e.message).toBe('');
      });
    });
  });

  describe('.setFailureResponse', () => {
    describe('when error is not an instance of ControllerError', () => {
      it('should set response status to internal server error', () => {
        const response = controllerTest.createResponse(() => {
        });

        controllerUtils.setFailureResponse(response, new Error('message'));

        expect(response.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
