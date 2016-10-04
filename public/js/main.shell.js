main.shell = (function () {
    'use strict';

    function initModule() {
        main.eval.initModule(onResponseReceived);
        main.history.initModule(main.eval.evaluateExpression);
        main.sim.initModule();
    }

    function onResponseReceived(responseBody) {
        main.history.processResponse(responseBody);
        main.sim.processResponse(responseBody);
    }

    return {
        initModule: initModule
    };
})();
