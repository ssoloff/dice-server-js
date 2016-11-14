/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const IssueTicketService = require('../../support/issue-ticket-service');
const RedeemTicketService = require('../../support/redeem-ticket-service');
const ValidateRedeemedTicketService = require('../../support/validate-redeemed-ticket-service');

function World() {
    this.createIssueTicketService = () => new IssueTicketService();
    this.createRedeemTicketService = () => new RedeemTicketService();
    this.createValidateRedeemedTicketService = () => new ValidateRedeemedTicketService();
}

module.exports = function() {
    this.World = World;
};
