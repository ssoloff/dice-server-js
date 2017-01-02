/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

module.exports = function () {
  return function (req, res, next) {
    const requestId = req.get('X-Request-ID')

    next()

    if (requestId) {
      res.set('X-Correlation-ID', requestId)
    }
  }
}
