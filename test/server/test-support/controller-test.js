/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const ja = require('json-assert');
const security = require('../../../src/server/util/security');
const securityTest = require('./security-test');

/**
 * Provides useful methods for testing a dice server controller.
 *
 * @module controller-test
 */
module.exports = {
  /**
   * Creates a new request for a controller.
   *
   * @returns {Object!} A new request.
   */
  createRequest() {
    return {
      body: null,
      protocol: 'http',

      get() {
        return 'host:1234';
      },
    };
  },

  /**
   * Creates a new response for a controller.
   *
   * @param {Function!} jsonCallback - The callback to invoke when the JSON
   *      associated with the response is set.  This callback accepts a
   *      single parameter that contains the JSON.
   *
   * @returns {Object!} A new response.
   */
  createResponse(jsonCallback) {
    const response = {
      json(json) {
        jsonCallback(json);
        return this;
      },

      status() {
        return this;
      },
    };
    spyOn(response, 'json').and.callThrough();
    spyOn(response, 'status').and.callThrough();
    return response;
  },

  /**
   * Creates a detached JSON web signature for the specified request/response
   * content.
   *
   * <p>
   * The returned JSON web signature uses the flattened JWS JSON
   * serialization.  It does not include the payload as it is a
   * detached signature.
   * </p>
   *
   * @param {Object!} content - The request/response content.
   *
   * @returns {Object!} The detached JSON web signature.
   */
  createSignature(content) {
    return security.createSignature(content, this.getPrivateKey(), this.getPublicKey());
  },

  /**
   * Returns the alternate private key to be used by secure controllers.
   *
   * @returns {Object!} The alternate private key to be used by secure
   *      controllers.
   */
  getOtherPrivateKey() {
    return securityTest.getOtherPrivateKey();
  },

  /**
   * Returns the alternate public key to be used by secure controllers.
   *
   * @returns {Object!} The alternate public key to be used by secure
   *      controllers.
   */
  getOtherPublicKey() {
    return securityTest.getOtherPublicKey();
  },

  /**
   * Returns the private key to be used by secure controllers.
   *
   * @returns {Object!} The private key to be used by secure controllers.
   */
  getPrivateKey() {
    return securityTest.getPrivateKey();
  },

  /**
   * Returns the public key to be used by secure controllers.
   *
   * @returns {Object!} The public key to be used by secure controllers.
   */
  getPublicKey() {
    return securityTest.getPublicKey();
  },

  /**
   * Indicates the actual response body equals the expected response body.
   *
   * <p>
   * This method implements the interface for a Jasmine custom equality
   * tester.
   * </p>
   *
   * @param {Object} actual - The actual response body.
   * @param {Object} expected - The expected response body.
   *
   * @returns {Boolean} `true` if `actual` equals `expected`; `false` if
   *      `actual` does not equal `expected`; or `undefined` if both `actual`
   *      and `expected` are not response body objects.
   */
  isResponseBodyEqual(actual, expected) {
    // istanbul ignore else
    if (ja.isEqual(expected, actual, true)) {
      return true;
    }
  },
};
