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

beforeEach(() => {
    jasmine.addMatchers({
        toBeSigned() {
            return {
                compare(obj) {
                    return {
                        message: 'Expected object to have a valid signature.',
                        pass: hasValidSignature(obj),
                    };
                },
            };
        },
    });
});
