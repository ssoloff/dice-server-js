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

var httpStatus = require('http-status-codes');
var request = require('request');

function RedeemTicketService() {
    this.request = {};
}

RedeemTicketService.prototype.call = function (callback) {
    var requestData = {
        body: this.request,
        json: true,
        uri: 'http://localhost:3000/redeem-ticket'
    };
    request.post(requestData, function (error, response, body) {
        if (!error && response.statusCode === httpStatus.OK) {
            callback(body);
        } else {
            throw new Error('unexpected response from redeem-ticket service');
        }
    });
};

RedeemTicketService.prototype.setRequestFromIssueTicketResponse = function (issueTicketResponse) {
    this.request.ticket = issueTicketResponse.success.ticket;
};

module.exports = RedeemTicketService;

