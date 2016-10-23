/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var ControllerError = require('../../../../../src/server/app/controllers/support/controller-error');

describe('ControllerError', function () {
    describe('.constructor', function () {
        it('should use a default message if one is not provided', function () {
            var error = new ControllerError(200, null);

            expect(error.message).not.toBeNull();
        });

        it('should use a default status if one is not provided', function () {
            var error = new ControllerError(null, 'message');

            expect(error.status).not.toBeNull();
        });
    });
});
