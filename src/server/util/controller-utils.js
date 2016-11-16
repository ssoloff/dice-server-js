/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const ControllerError = require('./controller-error');
const httpStatus = require('http-status-codes');

module.exports = {
  createControllerError(status, message) {
    return new ControllerError(status, message);
  },

  createControllerErrorFromResponse(responseStatus, responseBody) {
    const message = responseBody.error ? responseBody.error.message : null;
    return new ControllerError(responseStatus, message);
  },

  getRequestRootUrl(request) {
    return `${request.protocol}://${request.get('host')}`;
  },

  isSuccessResponse(responseStatus) {
    return responseStatus === httpStatus.OK;
  },

  postJson(callback, requestBody) {
    let responseBody;
    let responseStatus;
    const request = {
      body: requestBody,
    };
    const response = {
      json(json) {
        responseBody = json;
        return this;
      },

      status(status) {
        responseStatus = status;
        return this;
      },
    };
    callback(request, response);
    return [responseStatus, responseBody];
  },

  setFailureResponse(response, e) {
    if (e instanceof ControllerError) {
      response.status(e.status);
    } else {
      response.status(httpStatus.INTERNAL_SERVER_ERROR);
    }

    const responseBody = {
      error: {
        message: e.message,
      },
    };
    response.json(responseBody);
  },

  setSuccessResponse(response, responseBody) {
    response.status(httpStatus.OK).json(responseBody);
  },
};
