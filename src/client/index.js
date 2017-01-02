/*
 * Copyright (c) 2015-2017 Steven Soloff
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

var $ = require('jquery'),
    mainShell = require('./shell');

function initModule($container) {
    installStylesheets();
    installVendorJQueryPlugins();
    installLocalJQueryPlugins();

    mainShell.initModule($container);
}

function installLocalJQueryPlugins() {
    $.fn.extend({
        invisible: function () {
            return this.css('visibility', 'hidden');
        },

        visible: function () {
            return this.css('visibility', 'visible');
        }
    });

    $.extend({
        postJSON: function (url, data, settings) {
            return this.ajax($.extend({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: url
            }, settings));
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

module.exports = {};

$(function () {
    initModule($('#main'));
});
