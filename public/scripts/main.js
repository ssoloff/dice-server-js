function addExpressionResult(response) {
    'use strict';

    var $expressionTextCell = $('<td>').text(response.expression.text);
    var $expressionCanonicalTextCell = $('<td>').text(response.expression.canonicalText);
    var $expressionResultTextCell = $('<td>').text(response.expressionResult.text);
    var $expressionResultValueCell = $('<td>').text(response.expressionResult.value.toString());

    var $reevaluateButton = $('<button>').attr('name', 'reevaluate').text('Reevaluate').click(function () {
        evaluateExpression($expressionTextCell.text());
    });
    var $removeButton = $('<button>').attr('name', 'remove').text('Remove').click(function (event) {
        $(event.target).closest('tr').remove();
    });
    var $actionsCell = $('<td>').append($reevaluateButton, $removeButton);

    var $expressionResultRow = $('<tr>').append(
        $expressionTextCell,
        $expressionCanonicalTextCell,
        $expressionResultTextCell,
        $expressionResultValueCell,
        $actionsCell
    );
    $('#expressionResults').prepend($expressionResultRow);
}

function clearExpressionText() {
    'use strict';

    $('#expressionText').val('');
}

function evaluateExpression(expressionText) {
    'use strict';

    var requestBody = {
        expression: {
            text: expressionText
        }
    };

    var randomNumberGeneratorJson = $('#randomNumberGeneratorJson').val();
    if (randomNumberGeneratorJson) {
        requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
    }

    $.postJSON('/expression/evaluate', requestBody, processResponse, processErrorResponse);
}

function getExpressionText() {
    'use strict';

    var expressionText = $('#expressionText').val();
    var roundingFunction = $('input[name="roundingMode"]:checked').val();
    if (roundingFunction) {
        expressionText = roundingFunction + '(' + expressionText + ')';
    }
    return expressionText;
}

function hideErrorMessage() {
    'use strict';

    $('#errorMessage').invisible();
}

function hideHelp() {
    'use strict';

    $('#help').hide();
}

function initialize() {
    'use strict';

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
    'use strict';

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
    'use strict';

    var responseBody = jqxhr.responseJSON;
    if (responseBody && responseBody.error) {
        showErrorMessage(responseBody.error.message);
    }
}

function processResponse(responseBody) {
    'use strict';

    clearExpressionText();
    addExpressionResult(responseBody);
    hideErrorMessage();
}

function removeAllResults() {
    'use strict';

    $('#expressionResults').empty();
}

function showErrorMessage(message) {
    'use strict';

    $('#errorMessage').text(message).visible();
}

function toggleHelp() {
    'use strict';

    var $help = $('#help');
    var wasHelpVisible = $help.is(':visible');
    $help.toggle(400);

    var isHelpVisible = !wasHelpVisible;
    $('#toggleHelp').text(isHelpVisible ? 'hide help' : 'help');
}

function main() {
    'use strict';

    installJQueryPlugins();
    initialize();
}

$(document).ready(main);

