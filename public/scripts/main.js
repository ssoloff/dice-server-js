function addExpressionResult(response) {
    'use strict';

    var $expressionTextCell = $('<td>').text(response.expression.text);
    var $expressionCanonicalTextCell = $('<td>').text(response.expression.canonicalText);
    var $expressionResultTextCell = $('<td>').text(response.expressionResult.text);
    var $expressionResultValueCell = $('<td>').text(response.expressionResult.value.toString());

    var $reevaluateButton = $('<button>').attr('name', 'reevaluate').text('Reevaluate').click(function () {
        evaluate($expressionTextCell.text());
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

function evaluate(expressionText) {
    'use strict';

    var request = {
        expression: {
            text: expressionText
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

function hideErrorMessage() {
    'use strict';

    $('#errorMessage').invisible();
}

function initialize() {
    'use strict';

    hideErrorMessage();

    $('#expressionForm').submit(function (event) {
        evaluate(getExpressionText());
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
        showErrorMessage(response.error.message);
    } else {
        clearExpressionText();
        addExpressionResult(response);
        hideErrorMessage();
    }
}

function showErrorMessage(message) {
    'use strict';

    $('#errorMessage').text(message).visible();
}

function main() {
    'use strict';

    installJQueryPlugins();
    initialize();
}

$(document).ready(main);

