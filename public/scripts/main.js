(function () {
    'use strict';

    function addDieRollResults(response) {
        var DIE_SIZE = 40,
            MARGIN = 20,
            $canvas,
            dicePerRow;

        function drawDie(x, y, scale, vertices, vertex_indexes_list) {
            vertices.forEach(function (vertex) {
                vertex.x = x + scale * vertex.x;
                vertex.y = y + scale * vertex.y;
            });

            vertex_indexes_list.forEach(function (vertex_indexes) {
                var i = 1,
                    props = {
                        strokeStyle: 'black'
                    };

                vertex_indexes.forEach(function (vertex_index) {
                    props['x' + i] = vertices[vertex_index].x;
                    props['y' + i] = vertices[vertex_index].y;
                    i += 1;
                });
                $canvas.drawLine(props);
            });
        }

        function drawDieRollResultValue(x, y, dieRollResult) {
            $canvas.drawText({
                fillStyle: 'black',
                fontSize: '1em',
                text: dieRollResult.value.toString(),
                x: x,
                y: y
            });
        }

        $canvas = $('#dieRollResults');

        $canvas.clearCanvas();

        dicePerRow = Math.floor(($canvas.width() - 2 * MARGIN) / (DIE_SIZE + MARGIN));
        response.dieRollResults.forEach(function (dieRollResult, index) {
            var column,
                row,
                x,
                y;

            column = index % dicePerRow;
            x = MARGIN + column * (DIE_SIZE + MARGIN) + DIE_SIZE / 2;
            row = Math.floor(index / dicePerRow);
            y = MARGIN + row * (DIE_SIZE + MARGIN) + DIE_SIZE / 2;

            if (dieRollResult.sides === 4) {
                $canvas.drawPolygon({
                    radius: DIE_SIZE / 2,
                    sides: 3,
                    strokeStyle: 'black',
                    x: x,
                    y: y
                });
                drawDieRollResultValue(x, y, dieRollResult);
            } else if (dieRollResult.sides === 6) {
                drawDie(x, y, DIE_SIZE / 2, [
                    { x: -1.0000000, y: -1.0000000 },
                    { x:  1.0000000, y: -1.0000000 },
                    { x:  1.0000000, y:  1.0000000 },
                    { x: -1.0000000, y:  1.0000000 }
                ], [
                    [0, 1, 2, 3, 0]
                ]);
                drawDieRollResultValue(x, y, dieRollResult);
            } else if (dieRollResult.sides === 8) {
                drawDie(x, y, DIE_SIZE / 1.5, [
                    { x:  0.0000000, y: -0.8164966 },
                    { x:  0.7071068, y: -0.4082483 },
                    { x:  0.7071068, y:  0.4082483 },
                    { x:  0.0000000, y:  0.8164966 },
                    { x: -0.7071068, y:  0.4082483 },
                    { x: -0.7071068, y: -0.4082483 }
                ], [
                    [0, 1, 2, 3, 4, 5, 0],
                    [0, 2],
                    [0, 4],
                    [2, 4]
                ]);
                drawDieRollResultValue(x, y, dieRollResult);
            } else if (dieRollResult.sides === 12) {
                drawDie(x, y, DIE_SIZE / 3, [
                    { x:  0.000000, y: -1.0922415 },
                    { x:  1.000000, y: -0.3660254 },
                    { x:  0.618034, y:  0.8090170 },
                    { x: -0.618034, y:  0.8090170 },
                    { x: -1.000000, y: -0.3660254 },
                    { x:  0.000000, y: -1.7102755 },
                    { x:  1.000000, y: -1.3660254 },
                    { x:  1.618034, y: -0.5352331 },
                    { x:  1.618034, y:  0.5352331 },
                    { x:  1.000000, y:  1.3660254 },
                    { x:  0.000000, y:  1.7102755 },
                    { x: -1.000000, y:  1.3660254 },
                    { x: -1.618034, y:  0.5352331 },
                    { x: -1.618034, y: -0.5352331 },
                    { x: -1.000000, y: -1.3660254 }
                ], [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 5],
                    [0, 5],
                    [1, 7],
                    [2, 9],
                    [3, 11],
                    [4, 13]
                ]);
                drawDieRollResultValue(x, y, dieRollResult);
            } else if (dieRollResult.sides === 20) {
                drawDie(x, y, DIE_SIZE / 3, [
                    { x:  0.000000, y: -1.1547005 },
                    { x:  1.000000, y:  0.5773503 },
                    { x: -1.000000, y:  0.5773503 },
                    { x:  0.000000, y: -1.8683447 },
                    { x:  1.618034, y: -0.9341724 },
                    { x:  1.618034, y:  0.9341724 },
                    { x:  0.000000, y:  1.8683447 },
                    { x: -1.618034, y:  0.9341724 },
                    { x: -1.618034, y: -0.9341724 }
                ], [
                    [0, 1, 2, 0],
                    [3, 4, 5, 6, 7, 8, 3],
                    [0, 3],
                    [0, 4],
                    [0, 8],
                    [1, 4],
                    [1, 5],
                    [1, 6],
                    [2, 6],
                    [2, 7],
                    [2, 8]
                ]);
                drawDieRollResultValue(x, y, dieRollResult);
            } else {
                $canvas.drawEllipse({
                    height: DIE_SIZE,
                    strokeStyle: 'black',
                    width: DIE_SIZE,
                    x: x,
                    y: y
                });
                $canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '0.5em',
                    text: dieRollResult.sides.toString(),
                    x: x + DIE_SIZE / 2,
                    y: y + DIE_SIZE / 2
                });
                drawDieRollResultValue(x, y, dieRollResult);
            }
        });
    }

    function addExpressionResult(response) {
        var $actionsCell,
            $expressionCanonicalTextCell,
            $expressionResultRow,
            $expressionResultTextCell,
            $expressionResultValueCell,
            $expressionTextCell,
            $reevaluateButton,
            $removeButton;

        $expressionTextCell = $('<td>').text(response.expression.text);
        $expressionCanonicalTextCell = $('<td>').text(response.expression.canonicalText);
        $expressionResultTextCell = $('<td>').text(response.expressionResult.text);
        $expressionResultValueCell = $('<td>').text(response.expressionResult.value.toString());

        $reevaluateButton = $('<button>').attr('name', 'reevaluate').text('Reevaluate').click(function () {
            evaluateExpression($expressionTextCell.text());
        });
        $removeButton = $('<button>').attr('name', 'remove').text('Remove').click(function (event) {
            $(event.target).closest('tr').remove();
        });
        $actionsCell = $('<td>').append($reevaluateButton, $removeButton);

        $expressionResultRow = $('<tr>').append(
            $expressionTextCell,
            $expressionCanonicalTextCell,
            $expressionResultTextCell,
            $expressionResultValueCell,
            $actionsCell
        );
        $('#expressionResults').prepend($expressionResultRow);
    }

    function clearExpressionText() {
        $('#expressionText').val('');
    }

    function evaluateExpression(expressionText) {
        var randomNumberGeneratorJson,
            requestBody;

        requestBody = {
            expression: {
                text: expressionText
            }
        };

        randomNumberGeneratorJson = $('#randomNumberGeneratorJson').val();
        if (randomNumberGeneratorJson) {
            requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
        }

        $.postJSON('/expression/evaluate', requestBody, processResponse, processErrorResponse);
    }

    function getExpressionText() {
        var expressionText,
            roundingFunction;

        expressionText = $('#expressionText').val();
        roundingFunction = $('input[name="roundingMode"]:checked').val();
        if (roundingFunction) {
            expressionText = roundingFunction + '(' + expressionText + ')';
        }
        return expressionText;
    }

    function hideErrorMessage() {
        $('#errorMessage').invisible();
    }

    function hideHelp() {
        $('#help').hide();
    }

    function initialize() {
        hideHelp();
        hideErrorMessage();

        $('#expressionForm').submit(function (event) {
            evaluateExpression(getExpressionText());
            event.preventDefault();
        });
        $('#toggleHelp').click(toggleHelp);
        $('#removeAllResults').click(removeAllResults);
    }

    function installJQueryPlugins() {
        jQuery.fn.visible = function () {
            return this.css('visibility', 'visible');
        };

        jQuery.fn.invisible = function () {
            return this.css('visibility', 'hidden');
        };

        jQuery.extend({
            postJSON: function (url, data, successCallback, errorCallback) {
                return this.ajax({
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    error: errorCallback,
                    success: successCallback,
                    type: 'POST',
                    url: url
                });
            }
        });
    }

    function processErrorResponse(jqxhr) {
        var responseBody = jqxhr.responseJSON;

        if (responseBody && responseBody.error) {
            showErrorMessage(responseBody.error.message);
        }
    }

    function processResponse(responseBody) {
        clearExpressionText();
        addDieRollResults(responseBody);
        addExpressionResult(responseBody);
        hideErrorMessage();
    }

    function removeAllResults() {
        $('#expressionResults').empty();
    }

    function showErrorMessage(message) {
        $('#errorMessage').text(message).visible();
    }

    function toggleHelp() {
        var $help,
            isHelpVisible,
            wasHelpVisible;

        $help = $('#help');
        wasHelpVisible = $help.is(':visible');
        $help.toggle(400);

        isHelpVisible = !wasHelpVisible;
        $('#toggleHelp').text(isHelpVisible ? 'hide help' : 'help');
    }

    function main() {
        installJQueryPlugins();
        initialize();
    }

    $(document).ready(main);
})();
