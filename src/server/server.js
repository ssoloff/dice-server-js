/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const express = require('express')
const middleware = require('./middleware')
const path = require('path')
const routes = require('./routes')
const security = require('./util/security')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(middleware.correlationId())

const privateKey = security.getKey('private', process.argv[2], process.env.DSJS_PRIVATE_KEY)
const publicKey = security.getKey('public', process.argv[3], process.env.DSJS_PUBLIC_KEY)
routes(app, privateKey, publicKey)

app.listen(process.env.PORT || 3000)
