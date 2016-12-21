/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

/**
 * Top-level module for the Dice Server client application.
 *
 * @module index
 */

// --- BEGIN MODULE SCOPE VARIABLES --------------------------------------

var $ = require('jquery'),
    mainShell = require('./shell/index');

// --- END MODULE SCOPE VARIABLES ----------------------------------------

// --- BEGIN UTILITY METHODS ---------------------------------------------

function installLocalJQueryPlugins() {
    $.fn.visible = function () {
        return this.css('visibility', 'visible');
    };

    $.fn.invisible = function () {
        return this.css('visibility', 'hidden');
    };

    $.extend({
        postJSON: function (url, data, successCallback, errorCallback) {
            return this.ajax({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                error: errorCallback,
                success: successCallback,
                type: 'POST',
                url: url
            });
        }
    });
}

function installStylesheets() {
    require('./index.css');
}

function installVendorJQueryPlugins() {
    // CommonJS-aware plugins
    require('jcanvas')($, global.window);

    // CommonJS-unaware plugins (require jQuery in the global namespace)
    global.jQuery = $;
    require('jquery.event.gevent');
}

function initModule($container) {
    installStylesheets();
    installVendorJQueryPlugins();
    installLocalJQueryPlugins();

    mainShell.initModule($container);
}

// --- END UTILITY METHODS -----------------------------------------------

// --- BEGIN PUBLIC METHODS ----------------------------------------------

module.exports = {};

$(function () {
    initModule($('#main'));
});

// --- END PUBLIC METHODS ------------------------------------------------
