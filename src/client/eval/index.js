/*
 * Copyright (c) 2016 Steven Soloff
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

// --- BEGIN MODULE SCOPE VARIABLES --------------------------------------

var $ = require('jquery'),
    jQueryMap = {};

// --- END MODULE SCOPE VARIABLES ----------------------------------------

// --- BEGIN DOM METHODS -------------------------------------------------

function clearExpressionText() {
    jQueryMap.$expressionText.val('');
}

function evaluateExpression(expressionText) {
    var randomNumberGeneratorJson,
        requestBody;

    requestBody = {
        expression: {
            text: expressionText
        }
    };

    randomNumberGeneratorJson = jQueryMap.$randomNumberGeneratorJson.val();
    if (randomNumberGeneratorJson) {
        requestBody.randomNumberGenerator = JSON.parse(randomNumberGeneratorJson);
    }

    $.postJSON(
        '/expression/evaluate',
        requestBody,
        onEvaluateExpressionResponseSuccess,
        onEvaluateExpressionResponseError
    );
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
        $errorMessage: $container.find('#main-eval-errorMessage'),
        $expressionForm: $container.find('#main-eval-expressionForm'),
        $expressionText: $container.find('#main-eval-expressionText'),
        $help: $container.find('#main-eval-help'),
        $randomNumberGeneratorJson: $container.find('#main-eval-randomNumberGeneratorJson'),
        $toggleHelp: $container.find('#main-eval-toggleHelp')
    };
}

function initView() {
    hideHelp();
    hideErrorMessage();
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

// --- END DOM METHODS ---------------------------------------------------

// --- BEGIN EVENT HANDLERS ----------------------------------------------

function onEvaluateExpression(event, expressionText) {
    evaluateExpression(expressionText);
}

function onEvaluateExpressionResponseError(jqxhr) {
    var responseBody = jqxhr.responseJSON;

    if (responseBody && responseBody.error) {
        showErrorMessage(responseBody.error.message);
    }
}

function onEvaluateExpressionResponseSuccess(responseBody) {
    clearExpressionText();
    hideErrorMessage();

    $.gevent.publish('main-expressionevaluated', [responseBody]);
}

// --- END EVENT HANDLERS ------------------------------------------------

// --- BEGIN PUBLIC METHODS ----------------------------------------------

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
    $container.load('/main.eval.html', function () {
        initJQueryMap($container);
        initView();
        initController();

        $.gevent.subscribe(jQueryMap.$container, 'main-evaluateexpression', onEvaluateExpression);
    });
}

module.exports = {
    initModule: initModule
};

// --- END PUBLIC METHODS ------------------------------------------------
