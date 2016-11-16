/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const req = require('request');
const security = require('../../common/support/security');

class EvaluateExpressionService {
  constructor() {
    this.requestBody = {};
  }

  call(callback) {
    const requestData = {
      body: this.requestBody,
      json: true,
      uri: 'http://localhost:3000/expression/evaluate',
    };
    req.post(requestData, (error, response, body) => {
      if (!error) {
        callback(response.statusCode, body);
      } else {
        throw new Error(error);
      }
    });
  }

  setExpression(expressionText) {
    this.requestBody.expression = {
      text: expressionText,
    };
  }

  setRandomNumberGenerator(randomNumberGeneratorName) {
    const randomNumberGenerator = {
      content: {
        name: randomNumberGeneratorName,
      },
      signature: null,
    };
    randomNumberGenerator.signature = security.createSignature(randomNumberGenerator.content);
    this.requestBody.randomNumberGenerator = randomNumberGenerator;
  }
}

module.exports = EvaluateExpressionService;
