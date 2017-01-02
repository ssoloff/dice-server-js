/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const EvaluateExpressionService = require('../../support/evaluate-expression-service')
const objectUtil = require('../../support/object-util')

function World () {
  this.createEvaluateExpressionService = () => new EvaluateExpressionService()
  this.objectUtil = objectUtil
}

module.exports = function () {
  this.World = World
}
