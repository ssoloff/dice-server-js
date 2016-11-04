/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const req = require('request');

function ValidateRedeemedTicketService() {
    this.requestBody = {};
    this.requestUrl = null;
}

ValidateRedeemedTicketService.prototype.call = function (callback) {
    const requestData = {
        body: this.requestBody,
        json: true,
        uri: this.requestUrl
    };
    req.post(requestData, function (error, response, body) {
        if (!error) {
            callback(response.statusCode, body);
        } else {
            throw new Error(error);
        }
    });
};

ValidateRedeemedTicketService.prototype.setRequestFromRedeemTicketResponseBody = function (redeemTicketResponseBody) {
    this.requestBody.redeemedTicket = redeemTicketResponseBody.redeemedTicket;
    this.requestUrl = redeemTicketResponseBody.redeemedTicket.content.validateUrl;
};

module.exports = ValidateRedeemedTicketService;
