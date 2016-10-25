/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var _ = require('underscore'),
    Random = require('random-js');

module.exports = {
    constantMax: function () {
        return function (sides) {
            return sides;
        };
    },

    uniform: function (options) {
        var engine = Random.engines.mt19937();
        if (options && options.seed) {
            if (_.isArray(options.seed)) {
                engine = engine.seedWithArray(options.seed);
            } else {
                engine = engine.seed(options.seed);
            }
        } else {
            engine = engine.autoSeed();
        }

        return function (sides) {
            return Random.die(sides)(engine);
        };
    }
};
