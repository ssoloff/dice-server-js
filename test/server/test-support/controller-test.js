/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

var fs = require('fs'),
    ja = require('json-assert'),
    path = require('path'),
    security = require('../../../src/server/util/security');

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
    createRequest: function () {
        return {
            body: null,
            get: function () {
                return 'host:1234';
            },
            protocol: 'http'
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
    createResponse: function (jsonCallback) {
        var response = {
            json: function (json) {
                jsonCallback(json);
                return this;
            },
            status: function () {
                return this;
            }
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
    createSignature: function (content) {
        return security.createSignature(content, this.getPrivateKey(), this.getPublicKey());
    },

    /**
     * Returns the private key to be used by secure controllers.
     *
     * @returns {Object!} The private key to be used by secure controllers.
     */
    getPrivateKey: function () {
        return fs.readFileSync(path.join(__dirname, '../../../test/server/private-key.pem'));
    },

    /**
     * Returns the public key to be used by secure controllers.
     *
     * @returns {Object!} The public key to be used by secure controllers.
     */
    getPublicKey: function () {
        return fs.readFileSync(path.join(__dirname, '../../../test/server/public-key.pem'));
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
    isResponseBodyEqual: function (actual, expected) {
        // istanbul ignore else
        if (ja.isEqual(expected, actual, true)) {
            return true;
        }
    }
};
