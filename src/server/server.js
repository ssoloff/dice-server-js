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

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(correlator())

const privateKey = fs.readFileSync(process.argv[2])
const publicKey = fs.readFileSync(process.argv[3])
require('./routes')(app, privateKey, publicKey)

app.listen(process.env.PORT || 3000)
