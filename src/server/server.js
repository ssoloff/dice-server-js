/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const createApp = require('./app')
const security = require('./util/security')

const app = createApp({
  privateKey: security.getKey('private', process.argv[2], process.env.DSJS_PRIVATE_KEY),
  publicKey: security.getKey('public', process.argv[3], process.env.DSJS_PUBLIC_KEY)
})

app.listen(process.env.PORT || 3000)
