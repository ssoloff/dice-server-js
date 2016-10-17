/*
 * Copyright (c) 2016 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Top-level module for the Dice Server client application.
 *
 * @namespace main
 */
var main = (function () {
    'use strict';

    // --- BEGIN UTILITY METHODS ---------------------------------------------

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

    return {
        initModule: initModule
    };

    // --- END PUBLIC METHODS ------------------------------------------------

})();
