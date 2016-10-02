main.history = (function () {
    'use strict';

    var jQueryMap = {},
        stateMap = {
            evaluateExpression: null
        };

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
            stateMap.evaluateExpression($expressionTextCell.text());
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

    function initJQueryMap() {
        jQueryMap = {
            $expressionResults: $('#main-history-expressionResults'),
            $removeAllResults: $('#main-history-removeAllResults')
        };
    }

    function initModule(evaluateExpression) {
        stateMap.evaluateExpression = evaluateExpression;

        initJQueryMap();
        initController();
    }

    function processResponse(response) {
        addExpressionResult(response);
    }

    function removeAllResults() {
        jQueryMap.$expressionResults.empty();
    }

    return {
        initModule: initModule,
        processResponse: processResponse
    };
})();
