/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const httpStatus = require('http-status-codes');

function ControllerError(status, message) {
    this.name = 'ControllerError';
    this.message = message || '';
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
    this.stack = (new Error()).stack;
}

ControllerError.prototype = Object.create(Error.prototype);
ControllerError.prototype.constructor = ControllerError;

module.exports = ControllerError;
