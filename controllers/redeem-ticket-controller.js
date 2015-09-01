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

var evaluateController = require('./evaluate-controller');
var security = require('./security');

var controller = {
    privateKey: new Buffer(''),
    publicKey: new Buffer('')
};

function createResponseContent(request) {
    var evaluateResult = evaluate(request);
    var evaluateResponse = evaluateResult[1];
    if (evaluateResponse.success) {
        return {
            success: {
                description: request.description,
                expression: evaluateResponse.success.expression,
                expressionResult: evaluateResponse.success.expressionResult,
                id: request.id,
                randomNumberGenerator: evaluateResponse.success.randomNumberGenerator
            }
        };
    } else if (evaluateResponse.failure) {
        return {
            failure: {
                message: evaluateResponse.failure.message
            }
        };
    } else {
        var evaluateStatus = evaluateResult[0];
        return {
            failure: {
                message: 'evaluate controller returned status ' + evaluateStatus
            }
        };
    }
}

function createResponseSignature(content) {
    return security.createSignature(content, controller.privateKey, controller.publicKey);
}

function evaluate(request) {
    var evaluateRequest = {
        expression: request.expression,
        // TODO: need to get RNG from request
        randomNumberGenerator: {
            name: 'constantMax'
        }
    };
    var evaluateReq = {
        body: evaluateRequest
    };
    var evaluateResponse;
    var evaluateStatus;
    var evaluateRes = {
        json: function (json) {
            evaluateResponse = json;
            return this;
        },
        status: function (status) {
            evaluateStatus = status;
            return this;
        }
    };
    evaluateController.evaluate(evaluateReq, evaluateRes);

    return [evaluateStatus, evaluateResponse];
}

function redeemTicket(req, res) {
    var request = req.body;
    var responseContent = createResponseContent(request);
    var response = {
        content: responseContent,
        signature: createResponseSignature(responseContent)
    };
    res.status(200).json(response);
}

function setKeys(privateKey, publicKey) {
    controller.privateKey = privateKey;
    controller.publicKey = publicKey;
}

module.exports = {
    redeemTicket: redeemTicket,
    setKeys: setKeys
};

