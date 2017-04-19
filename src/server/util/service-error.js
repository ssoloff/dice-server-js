/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')

class ServiceError extends Error {
  constructor (status, message) {
    super(message || '')

    this.name = 'ServiceError'
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR
  }
}

module.exports = ServiceError
