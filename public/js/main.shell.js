main.shell = (function () {
    'use strict';

    var configMap = {
            mainHtml: '' +
                '<header>' +
                '   <h1>Dice Server</h1>' +
                '</header>' +
                '<main>' +
                '   <div id="main-eval-container"></div>' +
                '   <div id="main-sim-container"></div>' +
                '   <div id="main-history-container"></div>' +
                '</main>'
        };

    function initModule($container) {
        $container.html(configMap.mainHtml);

        main.eval.initModule($container.find('#main-eval-container'));
        main.history.initModule($container.find('#main-history-container'));
        main.sim.initModule($container.find('#main-sim-container'));
    }

    return {
        initModule: initModule
    };
})();
