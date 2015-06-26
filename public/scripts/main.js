function main() {
    "use strict";

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
            var $expressionResultValue = $("#expressionResultValue");
            if (response.error) {
                $expressionResultValue.text("");
                $errorMessage.text(response.error.message).show();
            } else {
                $expressionText.val("");
                $expressionResultValue.text(response.expressionResult.value.toString());
                $errorMessage.hide();
            }
        });
        event.preventDefault();
    });
}

$(document).ready(main);

