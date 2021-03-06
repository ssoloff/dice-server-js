/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

/**
 * The shell module is used to compose all core feature modules.
 *
 * @module shell/index
 */

'use strict';

var fs = require('fs'),
    mainEval = require('../eval'),
    mainHistory = require('../history'),
    mainSim = require('../sim');

/**
 * Initializes the shell module.
 *
 * @memberOf module:shell/index
 *
 * @param {Object!} $container - A jQuery collection that represents a
 *      single DOM element to be used as the container for the shell.
 */
function initModule($container) {
    $container.html(fs.readFileSync(__dirname + '/index.html', 'utf8'));

    mainEval.initModule($container.find('#main-eval-container'));
    mainHistory.initModule($container.find('#main-history-container'));
    mainSim.initModule($container.find('#main-sim-container'));
}

module.exports = {
    initModule: initModule
};
