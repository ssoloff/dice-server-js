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
