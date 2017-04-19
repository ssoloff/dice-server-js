/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const bodyParser = require('body-parser')
const correlationId = require('./correlation-id')
const express = require('express')
const notFound = require('./not-found')
const path = require('path')
const services = require('../services')

function middleware (app) {
  app.use(express.static(path.join(__dirname, '..', 'public')))
  app.use(correlationId())
  app.use(bodyParser.json())

  services(app)

  app.use(notFound())
}

module.exports = _.extend(middleware, {
  correlationId,
  notFound
})
