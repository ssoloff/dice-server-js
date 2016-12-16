/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

/**
 * Top-level module for the Dice Server client application.
 *
 * @namespace main
 */
(function (window, $) {
    'use strict';

    // --- BEGIN MODULE SCOPE VARIABLES --------------------------------------

    var main = {};

    // --- END MODULE SCOPE VARIABLES ----------------------------------------

    // --- BEGIN UTILITY METHODS ---------------------------------------------

    function installJQueryPlugins() {
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

    // --- END UTILITY METHODS -----------------------------------------------

    // --- BEGIN PUBLIC METHODS ----------------------------------------------

    /**
     * Initializes the application module.
     * @function main.initModule
     *
     * @param {Object!} $container - A jQuery collection that represents a
     *      single DOM element to be used as the container for the shell.
     */
    function initModule($container) {
        installJQueryPlugins();

        main.shell.initModule($container);
    }

    window.main = main = {
        initModule: initModule
    };

    // --- END PUBLIC METHODS ------------------------------------------------

}(window, jQuery)); // eslint-disable-line no-undef
