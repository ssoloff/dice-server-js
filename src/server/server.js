/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');

var privateKey = fs.readFileSync(process.argv[2]),
    publicKey = fs.readFileSync(process.argv[3]),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));
require('./app/routes')(app, privateKey, publicKey);

app.listen(3000);
