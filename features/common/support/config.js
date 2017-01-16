/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {
  baseUri: process.env.DSJS_BASE_URI || 'http://localhost:3000',
  privateKey: process.env.DSJS_PRIVATE_KEY ||
      fs.readFileSync(path.join(__dirname, '../../../test/server/test-keys/private-key.pem')),
  publicKey: process.env.DSJS_PUBLIC_KEY ||
      fs.readFileSync(path.join(__dirname, '../../../test/server/test-keys/public-key.pem'))
}
