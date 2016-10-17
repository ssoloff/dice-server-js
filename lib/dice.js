/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

/**
 * Facade for accessing the submodules in the library.
 *
 * @module dice
 */
module.exports = {
    /**
     * The bag submodule.
     *
     * @type {module:dice-bag}
     */
    bag: require('./dice-bag'),

    /**
     * The expression submodule.
     *
     * @type {module:dice-expression}
     */
    expression: require('./dice-expression'),

    /**
     * The expression formatter submodule.
     *
     * @type {module:dice-expression-formatter}
     */
    expressionFormatter: require('./dice-expression-formatter'),

    /**
     * The expression parser submodule.
     *
     * @type {module:dice-expression-parser}
     */
    expressionParser: require('./dice-expression-parser'),

    /**
     * The expression result submodule.
     *
     * @type {module:dice-expression-result}
     */
    expressionResult: require('./dice-expression-result'),

    /**
     * The expression result formatter submodule.
     *
     * @type {module:dice-expression-result-formatter}
     */
    expressionResultFormatter: require('./dice-expression-result-formatter')
};
