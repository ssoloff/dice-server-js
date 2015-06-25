function main() {
    "use strict";

    var $errorMessage = $("#errorMessage");
    $errorMessage.hide();

    $("#expressionForm").submit(function (event) {
        var $expression = $("#expression");
        var request = {
            expression: $expression.val()
        };
        $.post("/evaluate", request, function (response) {
            var $expressionResultValue = $("#expressionResultValue");
            if (response.error) {
                $expressionResultValue.text("");
                $errorMessage.text(response.error.message).show();
            } else {
                $expression.val("");
                $expressionResultValue.text(response.expressionResult.value.toString());
                $errorMessage.hide();
            }
        });
        event.preventDefault();
    });
}

$(document).ready(main);

