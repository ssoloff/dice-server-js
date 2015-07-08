function evaluate() {
    'use strict';

    var request = {
        expression: {
            text: getExpressionText()
        },
        randomNumberGenerator: {
            name: $('#randomNumberGeneratorName').val()
        }
    };
    $.post('/evaluate', request, processResponse);
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

function initialize() {
    'use strict';

    $('#errorMessage').invisible();

    $('#expressionForm').submit(function (event) {
        evaluate();
        event.preventDefault();
    });
}

function installJQueryPlugins() {
    'use strict';

    jQuery.fn.visible = function () {
        return this.css('visibility', 'visible');
    };

    jQuery.fn.invisible = function () {
        return this.css('visibility', 'hidden');
    };
}

function processResponse(response) {
    'use strict';

    if (response.error) {
        $('#errorMessage').text(response.error.message).visible();
    } else {
        $('#expressionText').val('');

        var $expressionTextColumn = $('<td>').text(response.expression.text);
        var $expressionCanonicalTextColumn = $('<td>').text(response.expression.canonicalText);
        var $expressionResultTextColumn = $('<td>').text(response.expressionResult.text);
        var $expressionResultValueColumn = $('<td>').text(response.expressionResult.value.toString());
        var $removeHistoryRowButton = $('<button>').text('Remove').click(function (event) {
            $(event.target).closest('tr').remove();
        });
        var $actionsColumn = $('<td>').append($removeHistoryRowButton);
        var $expressionResultRow = $('<tr>').append(
            $expressionTextColumn,
            $expressionCanonicalTextColumn,
            $expressionResultTextColumn,
            $expressionResultValueColumn,
            $actionsColumn
        );
        var $expressionResults = $('#expressionResults');
        $expressionResults.prepend($expressionResultRow);

        $('#errorMessage').invisible();
    }
}

function main() {
    'use strict';

    installJQueryPlugins();
    initialize();
}

$(document).ready(main);

