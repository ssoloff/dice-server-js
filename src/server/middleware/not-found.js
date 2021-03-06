/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const httpStatus = require('http-status-codes')

module.exports = () => {
  return (req, res) => {
    res.status(httpStatus.NOT_FOUND)

    if (req.accepts('html')) {
      return res.render('404')
    }

    if (req.accepts('json')) {
      return res.json({error: 'Not found'})
    }

    return res.type('text/plain').send('Not found')
  }
}
