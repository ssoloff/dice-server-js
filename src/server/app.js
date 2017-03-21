/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const express = require('express')
const middleware = require('./middleware')
const services = require('./services')

module.exports = (options = {}) => {
  const app = express()

  app.locals.privateKey = options.privateKey
  app.locals.publicKey = options.publicKey

  middleware({
    app,
    services
  })

  return app
}
