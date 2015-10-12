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

'use strict';

var fs = require('fs');
var path = require('path');
var req = require('request');
var security = require('../../../controllers/support/security');

function IssueTicketService() {
    this.privateKey = fs.readFileSync(path.join(__dirname, '../../../test/private-key.pem'));
    this.publicKey = fs.readFileSync(path.join(__dirname, '../../../test/public-key.pem'));
    this.requestBody = {
        evaluateExpressionRequestBody: {}
    };
}

IssueTicketService.prototype.call = function (callback) {
    var requestData = {
        body: this.requestBody,
        json: true,
        uri: 'http://localhost:3000/ticket/issue'
    };
    req.post(requestData, function (error, response, body) {
        if (!error) {
            callback(response.statusCode, body);
        } else {
            throw new Error(error);
        }
    });
};

IssueTicketService.prototype.setDescription = function (description) {
    this.requestBody.description = description;
};

IssueTicketService.prototype.setExpression = function (expressionText) {
    this.requestBody.evaluateExpressionRequestBody.expression = {
        text: expressionText
    };
};

IssueTicketService.prototype.setRandomNumberGenerator = function (randomNumberGeneratorName) {
    this.requestBody.evaluateExpressionRequestBody.randomNumberGenerator = {
        content: {
            name: randomNumberGeneratorName
        },
        signature: null
    };
    this.requestBody.evaluateExpressionRequestBody.randomNumberGenerator.signature = security.createSignature(
        this.requestBody.evaluateExpressionRequestBody.randomNumberGenerator.content,
        this.privateKey,
        this.publicKey
    );
};

module.exports = IssueTicketService;

