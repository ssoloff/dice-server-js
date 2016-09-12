(function () {
    'use strict';

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
            evaluateExpression($expressionTextCell.text());
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
        $('#expressionResults').prepend($expressionResultRow);
    }

    function clearExpressionText() {
        $('#expressionText').val('');
    }

    function evaluateExpression(expressionText) {
        var randomNumberGeneratorJson,
            requestBody;

        requestBody = {
            expression: {
                text: expressionText
            }
        };

        randomNumberGeneratorJson = $('#randomNumberGeneratorJson').val();
        if (randomNumberGeneratorJson) {
            requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
        }

        $.postJSON('/expression/evaluate', requestBody, processResponse, processErrorResponse);
    }

    function getExpressionText() {
        var expressionText,
            roundingFunction;

        expressionText = $('#expressionText').val();
        roundingFunction = $('input[name="roundingMode"]:checked').val();
        if (roundingFunction) {
            expressionText = roundingFunction + '(' + expressionText + ')';
        }
        return expressionText;
    }

    function hideErrorMessage() {
        $('#errorMessage').invisible();
    }

    function hideHelp() {
        $('#help').hide();
    }

    function initialize() {
        hideHelp();
        hideErrorMessage();

        $('#expressionForm').submit(function (event) {
            evaluateExpression(getExpressionText());
            event.preventDefault();
        });
        $('#toggleHelp').click(toggleHelp);
        $('#removeAllResults').click(removeAllResults);
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
        addExpressionResult(responseBody);
        hideErrorMessage();
    }

    function removeAllResults() {
        $('#expressionResults').empty();
    }

    function showErrorMessage(message) {
        $('#errorMessage').text(message).visible();
    }

    function toggleHelp() {
        var $help,
            isHelpVisible,
            wasHelpVisible;

        $help = $('#help');
        wasHelpVisible = $help.is(':visible');
        $help.toggle(400);

        isHelpVisible = !wasHelpVisible;
        $('#toggleHelp').text(isHelpVisible ? 'hide help' : 'help');
    }

    function main() {
        installJQueryPlugins();
        initialize();
    }

    $(document).ready(main);
})();
