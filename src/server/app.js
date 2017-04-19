/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const ejs = require('ejs')
const express = require('express')
const middleware = require('./middleware')
const path = require('path')

function configureLocals (app, options) {
  app.locals.privateKey = options.privateKey
  app.locals.publicKey = options.publicKey
}

function configureViewEngine (app) {
  app.set('views', path.join(__dirname, 'views'))
  app.engine('html', ejs.renderFile)
  app.set('view engine', 'html')
}

module.exports = (options = {}) => {
  const app = express()

  configureLocals(app, options)
  configureViewEngine(app)

  middleware(app)

  return app
}
