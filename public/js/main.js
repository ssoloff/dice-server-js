var main = (function () {
    'use strict';

    var jQueryMap = {};

    function clearExpressionText() {
        jQueryMap.$expressionText.val('');
    }

    function evaluateExpression(expressionText) {
        var randomNumberGeneratorJson,
            requestBody;

        requestBody = {
            expression: {
                text: expressionText
            }
        };

        randomNumberGeneratorJson = jQueryMap.$randomNumberGeneratorJson.val();
        if (randomNumberGeneratorJson) {
            requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
        }

        $.postJSON('/expression/evaluate', requestBody, processResponse, processErrorResponse);
    }

    function getExpressionText() {
        var expressionText,
            roundingFunction;

        expressionText = jQueryMap.$expressionText.val();
        roundingFunction = $('input[name="roundingMode"]:checked').val();
        if (roundingFunction) {
            expressionText = roundingFunction + '(' + expressionText + ')';
        }
        return expressionText;
    }

    function hideErrorMessage() {
        jQueryMap.$errorMessage.invisible();
    }

    function hideHelp() {
        jQueryMap.$help.hide();
    }

    function initController() {
        jQueryMap.$expressionForm.submit(function (event) {
            evaluateExpression(getExpressionText());
            event.preventDefault();
        });
        jQueryMap.$toggleHelp.click(toggleHelp);
    }

    function initJQueryMap() {
        jQueryMap = {
            $errorMessage: $('#main-errorMessage'),
            $expressionForm: $('#main-expressionForm'),
            $expressionText: $('#main-expressionText'),
            $help: $('#main-help'),
            $randomNumberGeneratorJson: $('#main-randomNumberGeneratorJson'),
            $toggleHelp: $('#main-toggleHelp')
        };
    }

    function initModule() {
        installJQueryPlugins();
        initJQueryMap();
        initView();
        initController();

        main.history.initModule(evaluateExpression);
        main.sim.initModule();
    }

    function initView() {
        hideHelp();
        hideErrorMessage();
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

    function processErrorResponse(jqxhr) {
        var responseBody = jqxhr.responseJSON;

        if (responseBody && responseBody.error) {
            showErrorMessage(responseBody.error.message);
        }
    }

    function processResponse(responseBody) {
        clearExpressionText();
        hideErrorMessage();

        main.history.processResponse(responseBody);
        main.sim.processResponse(responseBody);
    }

    function showErrorMessage(message) {
        jQueryMap.$errorMessage.text(message).visible();
    }

    function toggleHelp() {
        var isHelpVisible,
            wasHelpVisible;

        wasHelpVisible = jQueryMap.$help.is(':visible');
        jQueryMap.$help.toggle(400);

        isHelpVisible = !wasHelpVisible;
        jQueryMap.$toggleHelp.text(isHelpVisible ? 'hide help' : 'help');
    }

    return {
        initModule: initModule
    };
})();
