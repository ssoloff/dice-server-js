/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const correlator = require('./util/correlation-id')
const express = require('express')
const fs = require('fs')
const path = require('path')

function getKey (keyType, fileName, envValue) {
  if (fileName) {
    return fs.readFileSync(fileName)
  } else if (envValue) {
    return envValue
  }

  throw new Error(`${keyType} key not specified`)
}

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(correlator())

const privateKey = getKey('private', process.argv[2], process.env.DSJS_PRIVATE_KEY)
const publicKey = getKey('public', process.argv[3], process.env.DSJS_PUBLIC_KEY)
require('./routes')(app, privateKey, publicKey)

app.listen(process.env.PORT || 3000)
