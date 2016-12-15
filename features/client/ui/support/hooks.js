/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const driver = require('./driver')

module.exports = function () {
  this.registerHandler('AfterFeatures', (event, callback) => {
    driver.quit().then(() => callback())
  })
}
