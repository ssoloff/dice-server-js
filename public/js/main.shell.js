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
 * The shell module is used to compose all core feature modules.
 *
 * @namespace main.shell
 */
main.shell = (function () {
    'use strict';

    // --- BEGIN PUBLIC METHODS ----------------------------------------------

    /**
     * Initializes the shell module.
     * @function main.shell.initModule
     *
     * @param {Object!} $container - A jQuery collection that represents a
     *      single DOM element to be used as the container for the shell.
     */
    function initModule($container) {
        $container.load('/html/main.shell.html', function () {
            main.eval.initModule($container.find('#main-eval-container'));
            main.history.initModule($container.find('#main-history-container'));
            main.sim.initModule($container.find('#main-sim-container'));
        });
    }

    return {
        initModule: initModule
    };

    // --- END PUBLIC METHODS ------------------------------------------------

})();
