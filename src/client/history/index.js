/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

/**
 * The history module is used to display and manage previously evaluated
 * expressions.
 *
 * @module history/index
 */

'use strict';

var $ = require('jquery'),
    fs = require('fs'),
    jQueryMap = {};

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
        $.gevent.publish('main-evaluateexpression', [$expressionTextCell.text()]);
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
    jQueryMap.$expressionResults.prepend($expressionResultRow);
}

function initController() {
    jQueryMap.$removeAllResults.click(removeAllResults);
}

function initJQueryMap($container) {
    jQueryMap = {
        $container: $container,
        $expressionResults: $container.find('#main-history-expressionResults'),
        $removeAllResults: $container.find('#main-history-removeAllResults')
    };
}

/**
 * Initializes the history module.
 *
 * @memberOf module:history/index
 *
 * @param {Object!} $container - A jQuery collection that represents a
 *      single DOM element to be used as the container for the history
 *      controls.
 */
function initModule($container) {
    $container.html(fs.readFileSync(__dirname + '/index.html', 'utf8'));

    initJQueryMap($container);
    initController();

    $.gevent.subscribe(jQueryMap.$container, 'main-expressionevaluated', onExpressionEvaluated);
}

function onExpressionEvaluated(event, response) {
    addExpressionResult(response);
}

function removeAllResults() {
    jQueryMap.$expressionResults.empty();
}

module.exports = {
    initModule: initModule
};
