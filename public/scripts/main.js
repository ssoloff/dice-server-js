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
            var $expressionResult = $("#expressionResult");
            if (response.errorMessage) {
                $expressionResult.text("");
                $errorMessage.text(response.errorMessage).show();
            } else {
                $expression.val("");
                $expressionResult.text(response.expressionResult);
                $errorMessage.hide();
            }
        });
        event.preventDefault();
    });
}

$(document).ready(main);

