main.eval = (function () {
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

    function initJQueryMap($container) {
        jQueryMap = {
            $container: $container,
            $errorMessage: $container.find('#main-eval-errorMessage'),
            $expressionForm: $container.find('#main-eval-expressionForm'),
            $expressionText: $container.find('#main-eval-expressionText'),
            $help: $container.find('#main-eval-help'),
            $randomNumberGeneratorJson: $container.find('#main-eval-randomNumberGeneratorJson'),
            $toggleHelp: $container.find('#main-eval-toggleHelp')
        };
    }

    function initModule($container) {
        $.get('/html/main.eval.html', function (data) {
            $container.html(data);
            initJQueryMap($container);
            initView();
            initController();

            $.gevent.subscribe(jQueryMap.$container, 'main-evaluateexpression', onEvaluateExpression);
        });
    }

    function initView() {
        hideHelp();
        hideErrorMessage();
    }

    function onEvaluateExpression(event, expressionText) {
        evaluateExpression(expressionText);
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

        $.gevent.publish('main-expressionevaluated', [responseBody]);
    }

    function showErrorMessage(message) {
        jQueryMap.$errorMessage.text(message).visible();
    }

    function toggleHelp() {
        var newHelpVisible,
            oldHelpVisible;

        oldHelpVisible = jQueryMap.$help.is(':visible');
        jQueryMap.$help.toggle(400);

        newHelpVisible = !oldHelpVisible;
        jQueryMap.$toggleHelp.text(newHelpVisible ? 'hide help' : 'help');
    }

    return {
        initModule: initModule
    };
})();
