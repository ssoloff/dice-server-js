function main() {
    "use strict";

    $("#evaluate").click(function () {
        var $expression = $("#expression");
        var request = {
            expression: $expression.val()
        };
        $.post("/evaluate", request, function (response) {
            $expression.val("");
            $("#expressionResult").text(response.expressionResult);
        });
    });
}

$(document).ready(main);

