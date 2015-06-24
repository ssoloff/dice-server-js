function main() {
    "use strict";

    $("#expressionForm").submit(function (event) {
        var $expression = $("#expression");
        var request = {
            expression: $expression.val()
        };
        $.post("/evaluate", request, function (response) {
            $expression.val("");
            $("#expressionResult").text(response.expressionResult);
        });
        event.preventDefault();
    });
}

$(document).ready(main);

