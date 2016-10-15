/**
 * Top-level module for the Dice Server client application.
 *
 * @namespace main
 */
var main = (function () {
    'use strict';

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

    function installJQueryPlugins() {
        jQuery.fn.visible = function () {
            return this.css('visibility', 'visible');
        };

        jQuery.fn.invisible = function () {
            return this.css('visibility', 'hidden');
        };

        jQuery.extend({
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

    return {
        initModule: initModule
    };
})();
