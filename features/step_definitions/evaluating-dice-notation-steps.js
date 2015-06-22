/*
 * Copyright (c) 2015 Steven Soloff
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

"use strict";

var webdriver = require("selenium-webdriver");

var By = webdriver.By;

module.exports = function () {
    this.Given(/^the home page is open$/, function () {
        this.driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.firefox())
            .build();
        return this.driver.get('http://localhost:3000/');
    });

    this.When(/^the expression (.*) is evalulated$/, function (expression) {
        this.driver.findElement(By.id("expression")).sendKeys(expression);
        return this.driver.findElement(By.id("roll")).click();
    });

    this.Then(/^the result should be (.*)$/, function (expressionResult, callback) {
        console.log(expressionResult);
        callback.pending();
    });
};

