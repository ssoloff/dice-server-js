/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const config = require('../../../common/support/config')
const driver = require('./driver')
const HomePage = require('../../support/home-page')

function World () {
  this.createHomePage = () => new HomePage(driver)
}

module.exports = function () {
  this.World = World
  config.initCucumberDefaultTimeout(this)
}
