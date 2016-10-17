/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

/**
 * The sim module is used to display a 2D simulation of the dice rolled as part
 * of evaluating an expression.
 *
 * @namespace main.sim
 */
main.sim = (function () {
    'use strict';

    // --- BEGIN MODULE SCOPE VARIABLES --------------------------------------

    var configMap = {
            dicePerRow: null,
            dieSize: 40,
            margin: 20
        },
        jQueryMap = {};

    // --- END MODULE SCOPE VARIABLES ----------------------------------------

    // --- BEGIN UTILITY METHODS ---------------------------------------------

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

    // --- END UTILITY METHODS -----------------------------------------------

    // --- BEGIN DOM METHODS -------------------------------------------------

    function drawDice(dieRollResults) {
        var drawDieMapBySides = {
            '4': drawDie4,
            '6': drawDie6,
            '8': drawDie8,
            '12': drawDie12,
            '20': drawDie20
        };

        jQueryMap.$canvas.clearCanvas();

        dieRollResults.forEach(function (dieRollResult, index) {
            var center,
                column,
                drawDie,
                row;

            column = index % configMap.dicePerRow;
            row = Math.floor(index / configMap.dicePerRow);
            center = {
                x: configMap.margin + column * (configMap.dieSize + configMap.margin) + configMap.dieSize / 2,
                y: configMap.margin + row * (configMap.dieSize + configMap.margin) + configMap.dieSize / 2
            };
            drawDie = drawDieMapBySides[dieRollResult.sides.toString()] || drawGenericDie;
            drawDie(dieRollResult, center);
        });
    }

    function drawDie4(dieRollResult, center) {
        var vertices;

        vertices = calculateVertices(center, configMap.dieSize / 2, [
            { x:  0.0000000, y:  0.0000000 },
            { x:  0.0000000, y: -1.1547005 },
            { x:  1.0000000, y:  0.5773503 },
            { x: -1.0000000, y:  0.5773503 }
        ]);
        drawDieEdges(vertices, [
            [1, 2, 3, 1],
            [0, 1],
            [0, 2],
            [0, 3]
        ]);
        drawDieValue(
            dieRollResult,
            $.extend(calculateCentroid(vertices, [0, 2, 3]), {
                fontSize: configMap.dieSize / 4
            })
        );
        drawDieValue(
            dieRollResult,
            $.extend(calculateCentroid(vertices, [0, 3, 1]), {
                fontSize: configMap.dieSize / 4,
                rotate: 135
            })
        );
        drawDieValue(
            dieRollResult,
            $.extend(calculateCentroid(vertices, [0, 1, 2]), {
                fontSize: configMap.dieSize / 4,
                rotate: -135
            })
        );
    }

    function drawDie6(dieRollResult, center) {
        drawDieEdges(calculateVertices(center, configMap.dieSize / 2, [
            { x: -1.0000000, y: -1.0000000 },
            { x:  1.0000000, y: -1.0000000 },
            { x:  1.0000000, y:  1.0000000 },
            { x: -1.0000000, y:  1.0000000 }
        ]), [
            [0, 1, 2, 3, 0]
        ]);
        drawDieValue(dieRollResult, center);
    }

    function drawDie8(dieRollResult, center) {
        drawDieEdges(calculateVertices(center, configMap.dieSize / 1.5, [
            { x:  0.0000000, y: -0.8164966 },
            { x:  0.7071068, y: -0.4082483 },
            { x:  0.7071068, y:  0.4082483 },
            { x:  0.0000000, y:  0.8164966 },
            { x: -0.7071068, y:  0.4082483 },
            { x: -0.7071068, y: -0.4082483 }
        ]), [
            [0, 1, 2, 3, 4, 5, 0],
            [0, 2],
            [0, 4],
            [2, 4]
        ]);
        drawDieValue(dieRollResult, center);
    }

    function drawDie12(dieRollResult, center) {
        drawDieEdges(calculateVertices(center, configMap.dieSize / 3, [
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
        ]), [
            [0, 1, 2, 3, 4, 0],
            [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 5],
            [0, 5],
            [1, 7],
            [2, 9],
            [3, 11],
            [4, 13]
        ]);
        drawDieValue(dieRollResult, center);
    }

    function drawDie20(dieRollResult, center) {
        drawDieEdges(calculateVertices(center, configMap.dieSize / 3, [
            { x:  0.000000, y: -1.1547005 },
            { x:  1.000000, y:  0.5773503 },
            { x: -1.000000, y:  0.5773503 },
            { x:  0.000000, y: -1.8683447 },
            { x:  1.618034, y: -0.9341724 },
            { x:  1.618034, y:  0.9341724 },
            { x:  0.000000, y:  1.8683447 },
            { x: -1.618034, y:  0.9341724 },
            { x: -1.618034, y: -0.9341724 }
        ]), [
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
        drawDieValue(dieRollResult, center);
    }

    function drawDieEdges(vertices, vertexIndexesList) {
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

    function drawDieValue(dieRollResult, customProps) {
        var props = {
            fillStyle: 'black',
            fontSize: '1em',
            text: dieRollResult.value.toString()
        };

        jQueryMap.$canvas.drawText($.extend(props, customProps));
    }

    function drawGenericDie(dieRollResult, center) {
        jQueryMap.$canvas.drawEllipse({
            height: configMap.dieSize,
            strokeStyle: 'black',
            width: configMap.dieSize,
            x: center.x,
            y: center.y
        });
        jQueryMap.$canvas.drawText({
            fillStyle: 'black',
            fontSize: '0.5em',
            text: dieRollResult.sides.toString(),
            x: center.x + configMap.dieSize / 2,
            y: center.y + configMap.dieSize / 2
        });
        drawDieValue(dieRollResult, center);
    }

    function initJQueryMap($container) {
        jQueryMap = {
            $canvas: $container.find('#main-sim-dieRollResults'),
            $container: $container
        };
    }

    // --- END DOM METHODS ---------------------------------------------------

    // --- BEGIN EVENT HANDLERS ----------------------------------------------

    function onExpressionEvaluated(event, response) {
        drawDice(response.dieRollResults);
    }

    // --- END EVENT HANDLERS ------------------------------------------------

    // --- BEGIN PUBLIC METHODS ----------------------------------------------

    /**
     * Initializes the sim module.
     * @function main.sim.initModule
     *
     * @param {Object!} $container - A jQuery collection that represents a
     *      single DOM element to be used as the container for the sim
     *      controls.
     */
    function initModule($container) {
        $container.load('/html/main.sim.html', function () {
            initJQueryMap($container);

            configMap.dicePerRow = Math.floor(
                (jQueryMap.$canvas.width() - 2 * configMap.margin) /
                (configMap.dieSize + configMap.margin)
            );

            $.gevent.subscribe(jQueryMap.$container, 'main-expressionevaluated', onExpressionEvaluated);
        });
    }

    return {
        initModule: initModule
    };

    // --- END PUBLIC METHODS ------------------------------------------------

})();
