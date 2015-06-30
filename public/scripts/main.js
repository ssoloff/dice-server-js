function evaluate() {
    "use strict";

    var request = {
        expression: {
            text: getExpressionText()
        },
        randomNumberGenerator: {
            name: $("#randomNumberGeneratorName").val()
        }
    };
    $.post("/evaluate", request, processResponse);
}

function getExpressionText() {
    var expressionText = $("#expressionText").val();
    var roundingFunction = $("input[name='roundingMode']:checked").val();
    if (roundingFunction) {
        expressionText = roundingFunction + "(" + expressionText + ")";
    }
    return expressionText;
}

function initialize() {
    "use strict";

    $("#expressionResult").hide();
    $("#errorMessage").hide();

    $("#expressionForm").submit(function (event) {
        evaluate();
        event.preventDefault();
    });
}

function processResponse(response) {
    "use strict";

    if (response.error) {
        $("#expressionResult").hide();

        $("#errorMessage").text(response.error.message).show();
    } else {
        $("#expressionText").val("");

        $("#evaluatedExpressionText").text(response.expression.text);
        $("#expressionResultText").text(response.expressionResult.text);
        $("#expressionResultValue").text(response.expressionResult.value.toString());
        $("#expressionResult").show();

        $("#errorMessage").hide();
    }
}

function main() {
    "use strict";

    initialize();
}

$(document).ready(main);

