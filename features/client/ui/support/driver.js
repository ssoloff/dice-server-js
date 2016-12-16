/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const webdriver = require('selenium-webdriver')

const BROWSER_NAME = process.env.ENV_WEBDRIVER_BROWSER_NAME || 'phantomjs'
const driver = new webdriver.Builder()
  .forBrowser(BROWSER_NAME)
  .build()

module.exports = driver
