/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const fs = require('fs')
const webdriver = require('selenium-webdriver')

const capabilities = webdriver.Capabilities.phantomjs()
capabilities.set('build', process.env.DSJS_SAUCE_BUILD)
capabilities.set('name', process.env.DSJS_SAUCE_NAME)
capabilities.set('public', 'public')
capabilities.set('tunnelIdentifier', process.env.DSJS_SAUCE_TUNNEL_ID)

const driver = new webdriver.Builder()
  .withCapabilities(capabilities)
  .build()

const sessionIdFilePath = process.env.DSJS_SELENIUM_SESSION_ID_FILE
if (sessionIdFilePath) {
  driver.getSession().then(session => {
    fs.writeFile(sessionIdFilePath, session.getId())
  })
}

module.exports = driver
