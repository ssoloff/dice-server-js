function main() {
    "use strict";

    var $expressionResult = $("#expressionResult");
    $expressionResult.hide();
    var $errorMessage = $("#errorMessage");
    $errorMessage.hide();

    $("#expressionForm").submit(function (event) {
        var $expressionText = $("#expressionText");
        var request = {
            expression: {
                text: $expressionText.val()
            },
            randomNumberGenerator: {
                name: $("#randomNumberGeneratorName").val()
            }
        };
        $.post("/evaluate", request, function (response) {
            if (response.error) {
                $expressionResult.hide();

                $errorMessage.text(response.error.message).show();
            } else {
                $expressionText.val("");

                $("#evaluatedExpressionText").text(response.expression.text);
                $("#expressionResultText").text(response.expressionResult.text);
                $("#expressionResultValue").text(response.expressionResult.value.toString());
                $expressionResult.show();

                $errorMessage.hide();
            }
        });
        event.preventDefault();
    });
}

$(document).ready(main);

