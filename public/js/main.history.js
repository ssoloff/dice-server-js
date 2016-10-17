/*
 * Copyright (c) 2016 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * The history module is used to display and manage previously evaluated
 * expressions.
 *
 * @namespace main.history
 */
main.history = (function () {
    'use strict';

    // --- BEGIN MODULE SCOPE VARIABLES --------------------------------------

    var jQueryMap = {};

    // --- END MODULE SCOPE VARIABLES ----------------------------------------

    // --- BEGIN DOM METHODS -------------------------------------------------

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

    function removeAllResults() {
        jQueryMap.$expressionResults.empty();
    }

    // --- END DOM METHODS ---------------------------------------------------

    // --- BEGIN EVENT HANDLERS ----------------------------------------------

    function onExpressionEvaluated(event, response) {
        addExpressionResult(response);
    }

    // --- END EVENT HANDLERS ------------------------------------------------

    // --- BEGIN PUBLIC METHODS ----------------------------------------------

    /**
     * Initializes the history module.
     * @function main.history.initModule
     *
     * @param {Object!} $container - A jQuery collection that represents a
     *      single DOM element to be used as the container for the history
     *      controls.
     */
    function initModule($container) {
        $container.load('/html/main.history.html', function () {
            initJQueryMap($container);
            initController();

            $.gevent.subscribe(jQueryMap.$container, 'main-expressionevaluated', onExpressionEvaluated);
        });
    }

    return {
        initModule: initModule
    };

    // --- END PUBLIC METHODS ------------------------------------------------

})();
