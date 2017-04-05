/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const webdriver = require('selenium-webdriver')

const capabilities = webdriver.Capabilities.phantomjs()
capabilities.set('tunnelIdentifier', process.env.DSJS_SELENIUM_TUNNEL_ID)

const driver = new webdriver.Builder()
  .withCapabilities(capabilities)
  .build()

module.exports = driver
