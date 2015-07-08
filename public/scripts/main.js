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
    var expressionText = $('#expressionText').val();
    var roundingFunction = $('input[name="roundingMode"]:checked').val();
    if (roundingFunction) {
        expressionText = roundingFunction + '(' + expressionText + ')';
    }
    return expressionText;
}

function initialize() {
    'use strict';

    $('#expressionResult').hide();
    $('#errorMessage').hide();

    $('#expressionForm').submit(function (event) {
        evaluate();
        event.preventDefault();
    });
}

function processResponse(response) {
    'use strict';

    if (response.error) {
        $('#errorMessage').text(response.error.message).show();
    } else {
        $('#expressionText').val('');

        var $expressionCanonicalTextColumn = $('<td>').text(response.expression.canonicalText);
        var $expressionResultTextColumn = $('<td>').text(response.expressionResult.text);
        var $expressionResultValueColumn = $('<td>').text(response.expressionResult.value.toString());
        var $expressionResultRow = $('<tr>').append($expressionCanonicalTextColumn, $expressionResultTextColumn, $expressionResultValueColumn);
        var $expressionResults = $('#expressionResults');
        $expressionResults.prepend($expressionResultRow);

        $('#errorMessage').hide();
    }
}

function main() {
    'use strict';

    initialize();
}

$(document).ready(main);

