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
    $.postJSON('/expression/evaluate', request, processResponse);
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
        evaluate(getExpressionText());
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
        postJSON: function (url, data, callback) {
            return this.ajax({
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: callback,
                type: 'POST',
                url: url
            });
        }
    });
}

function processResponse(response) {
    'use strict';

    if (response.failure) {
        showErrorMessage(response.failure.message);
    } else {
        clearExpressionText();
        addExpressionResult(response.success);
        hideErrorMessage();
    }
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

