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

var chai = require("chai");
var webdriver = require("selenium-webdriver");

var By = webdriver.By;
var expect = chai.expect;

module.exports = function () {
    this.World = require("../support/world").World;

    this.Given(/^the home page is open$/, function () {
        return this.driver.get('http://localhost:3000/');
    });

    this.When(/^the expression (.+) is evaluated$/, function (expression) {
        this.driver.findElement(By.id("expression")).sendKeys(expression);
        return this.driver.findElement(By.id("evaluate")).click();
    });

    this.Then(/^the result should be (\d+)$/, function (expressionResult, callback) {
        this.driver.findElement(By.id("expressionResult")).getText().then(function (text) {
            expect(text).to.equal(expressionResult);
            callback();
        });
    });
};

