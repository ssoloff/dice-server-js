main.shell = (function () {
    'use strict';

    function initModule() {
        main.eval.initModule();
        main.history.initModule();
        main.sim.initModule();
    }

    return {
        initModule: initModule
    };
})();
