(function () {
    'use strict';

    function addDieRollResults(response) {
        var DIE_SIZE = 40,
            MARGIN = 20,
            $canvas,
            dicePerRow;

        $canvas = $('#dieRollResults');

        $canvas.clearCanvas();

        dicePerRow = Math.floor(($canvas.width() - 2 * MARGIN) / (DIE_SIZE + MARGIN));
        response.dieRollResults.forEach(function (dieRollResult, index) {
            var column,
                i,
                j,
                props,
                row,
                vertices,
                x,
                y;

            column = index % dicePerRow;
            x = MARGIN + column * (DIE_SIZE + MARGIN) + DIE_SIZE / 2;
            row = Math.floor(index / dicePerRow);
            y = MARGIN + row * (DIE_SIZE + MARGIN) + DIE_SIZE / 2;

            if (dieRollResult.sides === 4) {
                $canvas.drawPolygon({
                    radius: DIE_SIZE / 2,
                    rounded: true,
                    sides: 3,
                    strokeStyle: 'black',
                    x: x,
                    y: y
                });
                $canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '1em',
                    text: dieRollResult.value.toString(),
                    x: x,
                    y: y
                });
            } else if (dieRollResult.sides === 6) {
                $canvas.drawRect({
                    height: DIE_SIZE,
                    rounded: true,
                    strokeStyle: 'black',
                    width: DIE_SIZE,
                    x: x,
                    y: y
                });
                $canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '1em',
                    text: dieRollResult.value.toString(),
                    x: x,
                    y: y
                });
            } else if (dieRollResult.sides === 8) {
                vertices = [
                    { x:  0.0000000, y: -0.8164966 },
                    { x:  0.7071068, y: -0.4082483 },
                    { x:  0.7071068, y:  0.4082483 },
                    { x:  0.0000000, y:  0.8164966 },
                    { x: -0.7071068, y:  0.4082483 },
                    { x: -0.7071068, y: -0.4082483 }
                ];
                vertices.forEach(function (vertex) {
                    vertex.x *= DIE_SIZE / 1.5;
                    vertex.y *= DIE_SIZE / 1.5;
                });

                // draw line through vertices 1-5 (outer edge)
                props = {
                    closed: true,
                    rounded: true,
                    strokeStyle: 'black'
                };
                j = 1;
                for (i = 0; i < 6; i += 1) {
                    props['x' + j] = x + vertices[i].x;
                    props['y' + j] = y + vertices[i].y;
                    j += 1;
                }
                $canvas.drawLine(props);

                // draw lines between the following vertices (to complete
                // rendering the edges of the other 3 facets):
                //
                //    1 -> 3; 1 -> 5; 3 -> 5
                props = {
                    strokeStyle: 'black'
                };
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[0].x, y1: y + vertices[0].y,
                    x2: x + vertices[2].x, y2: y + vertices[2].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[0].x, y1: y + vertices[0].y,
                    x2: x + vertices[4].x, y2: y + vertices[4].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[2].x, y1: y + vertices[2].y,
                    x2: x + vertices[4].x, y2: y + vertices[4].y
                }));

                $canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '1em',
                    text: dieRollResult.value.toString(),
                    x: x,
                    y: y
                });
            } else if (dieRollResult.sides === 12) {
                vertices = [
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
                ];
                vertices.forEach(function (vertex) {
                    vertex.x *= DIE_SIZE / 3;
                    vertex.y *= DIE_SIZE / 3;
                });

                // draw line through vertices 1-5 (edges of top facet)
                props = {
                    closed: true,
                    rounded: true,
                    strokeStyle: 'black'
                };
                j = 1;
                for (i = 0; i < 5; i += 1) {
                    props['x' + j] = x + vertices[i].x;
                    props['y' + j] = y + vertices[i].y;
                    j += 1;
                }
                $canvas.drawLine(props);

                // draw line through vertices 6-15 (outer edge)
                j = 1;
                for (i = 5; i < 15; i += 1) {
                    props['x' + j] = x + vertices[i].x;
                    props['y' + j] = y + vertices[i].y;
                    j += 1;
                }
                $canvas.drawLine(props);

                // draw lines between the following vertices (to complete
                // rendering the edges of the other 5 facets):
                //
                //    1 -> 6; 2 -> 8; 3 -> 10; 4 -> 12; 5 -> 14
                props = {
                    strokeStyle: 'black'
                };
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[0].x, y1: y + vertices[0].y,
                    x2: x + vertices[5].x, y2: y + vertices[5].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[1].x, y1: y + vertices[1].y,
                    x2: x + vertices[7].x, y2: y + vertices[7].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[2].x, y1: y + vertices[2].y,
                    x2: x + vertices[9].x, y2: y + vertices[9].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[3].x, y1: y + vertices[3].y,
                    x2: x + vertices[11].x, y2: y + vertices[11].y
                }));
                $canvas.drawLine($.extend(props, {
                    x1: x + vertices[4].x, y1: y + vertices[4].y,
                    x2: x + vertices[13].x, y2: y + vertices[13].y
                }));

                $canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '1em',
                    text: dieRollResult.value.toString(),
                    x: x,
                    y: y
                });
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
                    fontSize: '1em',
                    text: dieRollResult.value.toString(),
                    x: x,
                    y: y
                });
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
