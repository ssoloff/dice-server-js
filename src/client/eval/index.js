/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

/**
 * The eval module is used to submit the expression to be evaluated and
 * configure all associated options for the evaluation operation.
 *
 * @module eval/index
 */

var $ = require('jquery'),
    fs = require('fs'),
    jQueryMap = {};

function clearExpressionText() {
    jQueryMap.$expressionText.val('');
}

function createRequestBody(expressionText) {
    var randomNumberGeneratorJson,
        requestBody = {
            expression: {
                text: expressionText
            }
        };

    randomNumberGeneratorJson = jQueryMap.$randomNumberGeneratorJson.val();
    if (randomNumberGeneratorJson) {
        requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
    }

    return requestBody;
}

function evaluateExpression(expressionText) {
    if (!expressionText) {
        return;
    }

    $.postJSON('/api/expression/evaluate', createRequestBody(expressionText), {
        success: onEvaluateExpressionResponseSuccess,
        error: onEvaluateExpressionResponseError,
        headers: {
            'X-Request-ID': newRequestId()
        }
    });
}

function getExpressionText() {
    var expressionText,
        roundingFunction;

    expressionText = jQueryMap.$expressionText.val();
    roundingFunction = $('input[name="roundingMode"]:checked').val();
    if (roundingFunction) {
        expressionText = roundingFunction + '(' + expressionText + ')';
    }
    return expressionText;
}

function hideErrorMessage() {
    jQueryMap.$errorMessage.invisible();
}

function hideHelp() {
    jQueryMap.$help.hide();
}

function initController() {
    jQueryMap.$expressionForm.submit(function (event) {
        evaluateExpression(getExpressionText());
        event.preventDefault();
    });
    jQueryMap.$toggleHelp.click(toggleHelp);
}

function initJQueryMap($container) {
    jQueryMap = {
        $container: $container,
        $correlationId: $container.find('#main-eval-correlationId'),
        $errorMessage: $container.find('#main-eval-errorMessage'),
        $expressionForm: $container.find('#main-eval-expressionForm'),
        $expressionText: $container.find('#main-eval-expressionText'),
        $help: $container.find('#main-eval-help'),
        $randomNumberGeneratorJson: $container.find('#main-eval-randomNumberGeneratorJson'),
        $requestId: $container.find('#main-eval-requestId'),
        $toggleHelp: $container.find('#main-eval-toggleHelp')
    };
}

/**
 * Initializes the eval module.
 *
 * @memberOf module:eval/index
 *
 * @param {Object!} $container - A jQuery collection that represents a
 *      single DOM element to be used as the container for the eval
 *      controls.
 */
function initModule($container) {
    $container.html(fs.readFileSync(__dirname + '/index.html', 'utf8'));

    initJQueryMap($container);
    initView();
    initController();

    $.gevent.subscribe(jQueryMap.$container, 'main-evaluateexpression', onEvaluateExpression);
}

function initView() {
    hideHelp();
    hideErrorMessage();
}

function newRequestId() {
    var requestId;

    function idFragment() {
        return Math.random().toString(36).substring(2, 15);
    }

    requestId = idFragment() + idFragment();

    jQueryMap.$requestId.val(requestId);
    jQueryMap.$correlationId.val('');

    return requestId;
}

function onEvaluateExpression(event, expressionText) {
    evaluateExpression(expressionText);
}

function onEvaluateExpressionResponseError(jqxhr) {
    var responseBody = jqxhr.responseJSON;

    if (responseBody && responseBody.error) {
        showErrorMessage(responseBody.error.message);
    }

    setCorrelationId(jqxhr);
}

function onEvaluateExpressionResponseSuccess(responseBody, textStatus, jqxhr) {
    clearExpressionText();
    hideErrorMessage();
    setCorrelationId(jqxhr);

    $.gevent.publish('main-expressionevaluated', [responseBody]);
}

function setCorrelationId(jqxhr) {
    var correlationId = jqxhr.getResponseHeader('X-Correlation-ID');

    if (correlationId) {
        jQueryMap.$correlationId.val(correlationId);
    }
}

function showErrorMessage(message) {
    jQueryMap.$errorMessage.text(message).visible();
}

function toggleHelp() {
    var newHelpVisible,
        oldHelpVisible;

    oldHelpVisible = jQueryMap.$help.is(':visible');
    jQueryMap.$help.toggle(400);

    newHelpVisible = !oldHelpVisible;
    jQueryMap.$toggleHelp.text(newHelpVisible ? 'hide help' : 'help');
}

module.exports = {
    initModule: initModule
};
