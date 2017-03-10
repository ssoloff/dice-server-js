/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')
const api = require('./api')

function services (app) {
  app.use('/api', api(app))
}

module.exports = _.extend(services, {
  api
})
