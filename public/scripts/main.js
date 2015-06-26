function evaluate() {
    "use strict";

    var request = {
        expression: {
            text: $("#expressionText").val()
        },
        randomNumberGenerator: {
            name: $("#randomNumberGeneratorName").val()
        }
    };
    $.post("/evaluate", request, processResponse);
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

