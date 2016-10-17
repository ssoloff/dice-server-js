/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();

module.exports = driver;
