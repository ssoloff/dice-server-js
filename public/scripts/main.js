function main() {
    "use strict";

    $("#roll").click(function () {
        var $expression = $("#expression");
        var request = {
            expression: $expression.val()
        };
        $.getJSON("/roll", request, function (response) {
            $expression.val("");
            $("#expressionResult").text(response.expressionResult);
        });
    });
}

$(document).ready(main);

