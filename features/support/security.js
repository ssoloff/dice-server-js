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
    security = require('../../src/server/util/security');

module.exports = {
    createSignature: function (payload) {
        return security.createSignature(
            payload,
            fs.readFileSync(path.join(__dirname, '../../test/server/test-keys/private-key.pem')),
            fs.readFileSync(path.join(__dirname, '../../test/server/test-keys/public-key.pem'))
        );
    }
};
