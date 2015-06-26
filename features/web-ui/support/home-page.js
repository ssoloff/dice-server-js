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

function HomePage(driver) {
    this.driver = driver;
}

HomePage.prototype.clearExpressionText = function () {
    return this.driver.findElement(By.id("expressionText")).clear();
};

HomePage.prototype.evaluate = function () {
    return this.driver.findElement(By.id("evaluate")).click();
};

HomePage.prototype.getErrorMessage = function () {
    return this.driver.findElement(By.id("errorMessage")).getText();
};

HomePage.prototype.getExpressionResultValue = function () {
    return this.driver.findElement(By.id("expressionResultValue")).getText();
};

HomePage.prototype.isErrorMessageDisplayed = function () {
    return this.driver.findElement(By.id("errorMessage")).isDisplayed();
};

HomePage.prototype.open = function () {
    return this.driver.get("http://localhost:3000/");
};

HomePage.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    return this.driver.executeScript("$('#randomNumberGeneratorName').val('" + randomNumberGeneratorName + "');");
};

HomePage.prototype.typeExpressionText = function (expression) {
    return this.driver.findElement(By.id("expressionText")).sendKeys(expression);
};

module.exports = HomePage;

