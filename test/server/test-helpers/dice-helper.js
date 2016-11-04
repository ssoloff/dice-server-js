/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const security = require('../../../src/server/util/security');

function hasValidSignature(obj) {
    return security.verifySignature(obj.content, obj.signature);
}

beforeEach(function () {
    jasmine.addMatchers({
        toBeSigned: function () {
            return {
                compare: function (obj) {
                    return {
                        message: 'Expected object to have a valid signature.',
                        pass: hasValidSignature(obj)
                    };
                }
            };
        }
    });
});
