/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')
const ServiceError = require('./service-error')

module.exports = {
  createServiceError (status, message) {
    return new ServiceError(status, message)
  },

  createServiceErrorFromResponse (responseStatus, responseBody) {
    const message = responseBody.error ? responseBody.error.message : null
    return new ServiceError(responseStatus, message)
  },

  getRequestRootUrl (request) {
    const protocol = request.get('X-Forwarded-Proto') || request.protocol
    const host = request.get('Host')
    const path = (request.baseUrl !== '/') ? request.baseUrl : ''
    return `${protocol}://${host}${path}`
  },

  isSuccessResponse (responseStatus) {
    return responseStatus === httpStatus.OK
  },

  postJson (callback, requestBody) {
    let responseBody,
      responseStatus
    const request = {
      body: requestBody
    }
    const response = {
      json (json) {
        responseBody = json
        return this
      },

      status (status) {
        responseStatus = status
        return this
      }
    }
    callback(request, response)
    return [responseStatus, responseBody]
  },

  setFailureResponse (response, e) {
    if (e instanceof ServiceError) {
      response.status(e.status)
    } else {
      response.status(httpStatus.INTERNAL_SERVER_ERROR)
    }

    const responseBody = {
      error: {
        message: e.message
      }
    }
    response.json(responseBody)
  },

  setSuccessResponse (response, responseBody) {
    response.status(httpStatus.OK).json(responseBody)
  }
}
