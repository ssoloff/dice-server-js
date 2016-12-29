/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const _ = require('underscore')

module.exports = {
  getPropertyValue (obj, name) {
    return obj[_.findKey(obj, (value, key) => key.toLowerCase() === name.toLowerCase())]
  }
}
