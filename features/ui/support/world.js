/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var driver = require('../support/driver'),
    HomePage = require('../support/home-page');

function World() {
    this.createHomePage = function () {
        return new HomePage(driver);
    };
}

module.exports = function () {
    this.World = World;
};
