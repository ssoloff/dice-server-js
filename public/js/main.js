var main = (function () {
    'use strict';

    function initModule() {
        installJQueryPlugins();

        main.eval.initModule(onResponseReceived);
        main.history.initModule(main.eval.evaluateExpression);
        main.sim.initModule();
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

    function onResponseReceived(responseBody) {
        main.history.processResponse(responseBody);
        main.sim.processResponse(responseBody);
    }

    return {
        initModule: initModule
    };
})();
