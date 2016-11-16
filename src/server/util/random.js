/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const _ = require('underscore');
const Random = require('random-js');

module.exports = {
  constantMax() {
    return (sides) => sides;
  },

  uniform(options) {
    let engine = Random.engines.mt19937();
    if (options && options.seed) {
      if (_.isArray(options.seed)) {
        engine = engine.seedWithArray(options.seed);
      } else {
        engine = engine.seed(options.seed);
      }
    } else {
      engine = engine.autoSeed();
    }

    return (sides) => Random.die(sides)(engine);
  },
};
