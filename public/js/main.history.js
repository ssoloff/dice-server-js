main.history = (function () {
    'use strict';

    var configMap = {
            mainHtml: '' +
                '<div>' +
                '    <button id="main-history-removeAllResults">Remove All</button>' +
                '</div>' +
                '<table class="main-history-expressionResults">' +
                '    <colgroup>' +
                '        <col class="main-history-expressionText">' +
                '        <col class="main-history-expressionCanonicalText">' +
                '        <col class="main-history-expressionResultText">' +
                '        <col class="main-history-expressionResultValue">' +
                '        <col class="main-history-expressionResultsActions">' +
                '    </colgroup>' +
                '    <thead>' +
                '        <tr>' +
                '            <th colspan="2">Expression</th>' +
                '            <th colspan="2">Expression Result</th>' +
                '            <th rowspan="2">Actions</th>' +
                '        </tr>' +
                '        <tr>' +
                '            <th>Text</th>' +
                '            <th>Canonical Text</th>' +
                '            <th>Text</th>' +
                '            <th>Value</th>' +
                '        </tr>' +
                '    </thead>' +
                '    <tbody id="main-history-expressionResults">' +
                '    </tbody>' +
                '</table>'
        },
        jQueryMap = {};

    function addExpressionResult(response) {
        var $actionsCell,
            $expressionCanonicalTextCell,
            $expressionResultRow,
            $expressionResultTextCell,
            $expressionResultValueCell,
            $expressionTextCell,
            $reevaluateButton,
            $removeButton;

        $expressionTextCell = $('<td>').text(response.expression.text);
        $expressionCanonicalTextCell = $('<td>').text(response.expression.canonicalText);
        $expressionResultTextCell = $('<td>').text(response.expressionResult.text);
        $expressionResultValueCell = $('<td>').text(response.expressionResult.value.toString());

        $reevaluateButton = $('<button>').attr('name', 'reevaluate').text('Reevaluate').click(function () {
            $.gevent.publish('main-evaluateexpression', [$expressionTextCell.text()]);
        });
        $removeButton = $('<button>').attr('name', 'remove').text('Remove').click(function (event) {
            $(event.target).closest('tr').remove();
        });
        $actionsCell = $('<td>').append($reevaluateButton, $removeButton);

        $expressionResultRow = $('<tr>').append(
            $expressionTextCell,
            $expressionCanonicalTextCell,
            $expressionResultTextCell,
            $expressionResultValueCell,
            $actionsCell
        );
        jQueryMap.$expressionResults.prepend($expressionResultRow);
    }

    function initController() {
        jQueryMap.$removeAllResults.click(removeAllResults);
    }

    function initJQueryMap($container) {
        jQueryMap = {
            $container: $container,
            $expressionResults: $container.find('#main-history-expressionResults'),
            $removeAllResults: $container.find('#main-history-removeAllResults')
        };
    }

    function initModule($container) {
        $container.html(configMap.mainHtml);
        initJQueryMap($container);
        initController();

        $.gevent.subscribe(jQueryMap.$container, 'main-expressionevaluated', onExpressionEvaluated);
    }

    function onExpressionEvaluated(event, response) {
        addExpressionResult(response);
    }

    function removeAllResults() {
        jQueryMap.$expressionResults.empty();
    }

    return {
        initModule: initModule
    };
})();
