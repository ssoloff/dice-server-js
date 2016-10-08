main.eval = (function () {
    'use strict';

    var configMap = {
            mainHtml: '' +
                '<form id="main-eval-expressionForm">' +
                '    <div>' +
                '        <label for="main-eval-expressionText">Expression:</label>' +
                '        <input id="main-eval-expressionText" required type="text">' +
                '        <button id="main-eval-evaluate" type="submit">Evaluate</button>' +
                '        <a href="#" id="main-eval-toggleHelp">help</a>' +
                '    </div>' +
                '    <div>' +
                '        <label>Rounding mode:</label>' +
                '        <input checked id="main-eval-roundingModeNone" name="roundingMode" type="radio" value="">No rounding' +
                '        <input id="main-eval-roundingModeTruncate" name="roundingMode" type="radio" value="trunc">Round towards zero' +
                '        <input id="main-eval-roundingModeFloor" name="roundingMode" type="radio" value="floor">Round down' +
                '        <input id="main-eval-roundingModeCeiling" name="roundingMode" type="radio" value="ceil">Round up' +
                '        <input id="main-eval-roundingModeNearest" name="roundingMode" type="radio" value="round">Round to nearest' +
                '    </div>' +
                '    <input id="main-eval-randomNumberGeneratorJson" type="hidden" value="">' +
                '</form>' +
                '<div id="main-eval-help">' +
                '    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula maximus' +
                '    purus. Suspendisse sollicitudin quam a auctor viverra. Nullam enim nunc,' +
                '    scelerisque in metus eu, elementum interdum ligula. Sed sit amet dui sed nisi' +
                '    consectetur pharetra eu vel ligula. Aliquam bibendum, massa at maximus tristique,' +
                '    urna massa posuere nisi, vel aliquet magna eros nec urna. Nunc et lacinia purus.' +
                '    Fusce non venenatis nisl, pharetra tristique metus. Pellentesque mollis facilisis' +
                '    est et pulvinar. In facilisis consequat sollicitudin. Vestibulum leo nisl, iaculis' +
                '    et porta id, semper sed ipsum. Pellentesque habitant morbi tristique senectus et' +
                '    netus et malesuada fames ac turpis egestas. Vestibulum ullamcorper ultrices rutrum.' +
                '    Aliquam sit amet bibendum elit, eu pellentesque quam.' +
                '</div>' +
                '<div class="main-eval-error" id="main-eval-errorMessage">' +
                '    &nbsp;' +
                '</div>'
        },
        jQueryMap = {};

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
        $container.html(configMap.mainHtml);
        initJQueryMap($container);
        initView();
        initController();

        $.gevent.subscribe(jQueryMap.$container, 'main-evaluateexpression', onEvaluateExpression);
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
