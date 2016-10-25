/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    security = require('../../src/server/app/controllers/support/security');

module.exports = {
    createSignature: function (payload) {
        return security.createSignature(
            payload,
            fs.readFileSync(path.join(__dirname, '../../test/server/private-key.pem')),
            fs.readFileSync(path.join(__dirname, '../../test/server/public-key.pem'))
        );
    }
};
