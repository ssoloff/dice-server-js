main.shell = (function () {
    'use strict';

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
})();
