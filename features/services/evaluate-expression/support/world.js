/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var EvaluateExpressionService = require('../../support/evaluate-expression-service');

function World() {
    this.createEvaluateExpressionService = function () {
        return new EvaluateExpressionService();
    };
}

module.exports = function () {
    this.World = World;
};
