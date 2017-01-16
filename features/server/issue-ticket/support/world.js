/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const config = require('../../../common/support/config')
const IssueTicketService = require('../../support/issue-ticket-service')

function World () {
  this.createIssueTicketService = () => new IssueTicketService()
}

module.exports = function () {
  this.World = World
  config.initCucumberDefaultTimeout(this)
}
