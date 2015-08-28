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

var crypto = require('crypto');
var dice = require('../lib/dice');

var controller = {
    privateKey: new Buffer(''),
    publicKey: new Buffer('')
};

function createResponseContent(request) {
    var content = {};

    try {
        var expressionParser = dice.expressionParser.create();
        expressionParser.parse(request.expression.text); // verify expression is valid

        content = {
            success: {
                description: request.description,
                expression: {
                    text: request.expression.text
                },
                id: createTicketId()
            }
        };
    }
    catch (e) {
        content = {
            failure: {
                message: e.message
            }
        };
    }

    return content;
}

function createTicketId() {
    return crypto.randomBytes(20).toString('hex');
}

function issueTicket(req, res) {
    var request = req.body;
    var responseContent = createResponseContent(request);
    var response = {
        content: responseContent
    };
    res.status(200).json(response);
}

function setKeys(privateKey, publicKey) {
    controller.privateKey = privateKey;
    controller.publicKey = publicKey;
}

module.exports = {
    issueTicket: issueTicket,
    setKeys: setKeys
};

