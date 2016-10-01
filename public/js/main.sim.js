main.sim = (function () {
    'use strict';

    var jQueryMap = {};

    function addDieRollResults(dieRollResults) {
        var DIE_SIZE = 40,
            MARGIN = 20,
            dicePerRow;

        jQueryMap.$canvas.clearCanvas();

        dicePerRow = Math.floor((jQueryMap.$canvas.width() - 2 * MARGIN) / (DIE_SIZE + MARGIN));
        dieRollResults.forEach(function (dieRollResult, index) {
            var center,
                column,
                row,
                vertices;

            column = index % dicePerRow;
            row = Math.floor(index / dicePerRow);
            center = {
                x: MARGIN + column * (DIE_SIZE + MARGIN) + DIE_SIZE / 2,
                y: MARGIN + row * (DIE_SIZE + MARGIN) + DIE_SIZE / 2
            };

            if (dieRollResult.sides === 4) {
                vertices = calculateVertices(center, DIE_SIZE / 2, [
                    { x:  0.0000000, y:  0.0000000 },
                    { x:  0.0000000, y: -1.1547005 },
                    { x:  1.0000000, y:  0.5773503 },
                    { x: -1.0000000, y:  0.5773503 }
                ]);
                drawDie(vertices, [
                    [1, 2, 3, 1],
                    [0, 1],
                    [0, 2],
                    [0, 3]
                ]);
                drawDieRollResultValue(
                    dieRollResult,
                    $.extend(calculateCentroid(vertices, [0, 2, 3]), {
                        fontSize: DIE_SIZE / 4
                    })
                );
                drawDieRollResultValue(
                    dieRollResult,
                    $.extend(calculateCentroid(vertices, [0, 3, 1]), {
                        fontSize: DIE_SIZE / 4,
                        rotate: 135
                    })
                );
                drawDieRollResultValue(
                    dieRollResult,
                    $.extend(calculateCentroid(vertices, [0, 1, 2]), {
                        fontSize: DIE_SIZE / 4,
                        rotate: -135
                    })
                );
            } else if (dieRollResult.sides === 6) {
                vertices = calculateVertices(center, DIE_SIZE / 2, [
                    { x: -1.0000000, y: -1.0000000 },
                    { x:  1.0000000, y: -1.0000000 },
                    { x:  1.0000000, y:  1.0000000 },
                    { x: -1.0000000, y:  1.0000000 }
                ]);
                drawDie(vertices, [
                    [0, 1, 2, 3, 0]
                ]);
                drawDieRollResultValue(dieRollResult, center);
            } else if (dieRollResult.sides === 8) {
                vertices = calculateVertices(center, DIE_SIZE / 1.5, [
                    { x:  0.0000000, y: -0.8164966 },
                    { x:  0.7071068, y: -0.4082483 },
                    { x:  0.7071068, y:  0.4082483 },
                    { x:  0.0000000, y:  0.8164966 },
                    { x: -0.7071068, y:  0.4082483 },
                    { x: -0.7071068, y: -0.4082483 }
                ]);
                drawDie(vertices, [
                    [0, 1, 2, 3, 4, 5, 0],
                    [0, 2],
                    [0, 4],
                    [2, 4]
                ]);
                drawDieRollResultValue(dieRollResult, center);
            } else if (dieRollResult.sides === 12) {
                vertices = calculateVertices(center, DIE_SIZE / 3, [
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
                ]);
                drawDie(vertices, [
                    [0, 1, 2, 3, 4, 0],
                    [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 5],
                    [0, 5],
                    [1, 7],
                    [2, 9],
                    [3, 11],
                    [4, 13]
                ]);
                drawDieRollResultValue(dieRollResult, center);
            } else if (dieRollResult.sides === 20) {
                vertices = calculateVertices(center, DIE_SIZE / 3, [
                    { x:  0.000000, y: -1.1547005 },
                    { x:  1.000000, y:  0.5773503 },
                    { x: -1.000000, y:  0.5773503 },
                    { x:  0.000000, y: -1.8683447 },
                    { x:  1.618034, y: -0.9341724 },
                    { x:  1.618034, y:  0.9341724 },
                    { x:  0.000000, y:  1.8683447 },
                    { x: -1.618034, y:  0.9341724 },
                    { x: -1.618034, y: -0.9341724 }
                ]);
                drawDie(vertices, [
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
                drawDieRollResultValue(dieRollResult, center);
            } else {
                jQueryMap.$canvas.drawEllipse({
                    height: DIE_SIZE,
                    strokeStyle: 'black',
                    width: DIE_SIZE,
                    x: center.x,
                    y: center.y
                });
                jQueryMap.$canvas.drawText({
                    fillStyle: 'black',
                    fontSize: '0.5em',
                    text: dieRollResult.sides.toString(),
                    x: center.x + DIE_SIZE / 2,
                    y: center.y + DIE_SIZE / 2
                });
                drawDieRollResultValue(dieRollResult, center);
            }
        });
    }

    function calculateCentroid(vertices, vertexIndexes) {
        var centroid = {
            x: 0,
            y: 0
        };

        vertexIndexes.forEach(function (vertexIndex) {
            centroid.x += vertices[vertexIndex].x;
            centroid.y += vertices[vertexIndex].y;
        });
        centroid.x /= vertexIndexes.length;
        centroid.y /= vertexIndexes.length;
        return centroid;
    }

    function calculateVertices(center, scale, baseVertices) {
        var vertices = [];

        baseVertices.forEach(function (baseVertex) {
            vertices.push({
                x: center.x + scale * baseVertex.x,
                y: center.y + scale * baseVertex.y
            });
        });
        return vertices;
    }

    function drawDie(vertices, vertexIndexesList) {
        vertexIndexesList.forEach(function (vertexIndexes) {
            var i = 1,
                props = {
                    strokeStyle: 'black'
                };

            vertexIndexes.forEach(function (vertexIndex) {
                props['x' + i] = vertices[vertexIndex].x;
                props['y' + i] = vertices[vertexIndex].y;
                i += 1;
            });
            jQueryMap.$canvas.drawLine(props);
        });
    }

    function drawDieRollResultValue(dieRollResult, customProps) {
        var props = {
            fillStyle: 'black',
            fontSize: '1em',
            text: dieRollResult.value.toString()
        };

        jQueryMap.$canvas.drawText($.extend(props, customProps));
    }

    function initJQueryMap() {
        jQueryMap = {
            $canvas: $('#main-sim-dieRollResults')
        };
    }

    function initModule() {
        initJQueryMap();
    }

    function processResponse(response) {
        addDieRollResults(response.dieRollResults);
    }

    return {
        initModule: initModule,
        processResponse: processResponse
    };
})();
