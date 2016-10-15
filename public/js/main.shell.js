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
        $.get('/html/main.shell.html', function (data) {
            $container.html(data);

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
