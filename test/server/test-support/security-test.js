/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Provides useful methods for testing aspects related to security.
 *
 * @module security-test
 */
module.exports = {
    /**
     * Returns the alternate private key to use for security testing.
     *
     * @returns {Object!} The alternate private key to use for security
     *      testing.
     */
    getOtherPrivateKey() {
        return fs.readFileSync(path.join(__dirname, '../test-keys/other-private-key.pem'));
    },

    /**
     * Returns the alternate public key to use for security testing.
     *
     * @returns {Object!} The alternate public key to use for security
     *      testing.
     */
    getOtherPublicKey() {
        return fs.readFileSync(path.join(__dirname, '../test-keys/other-public-key.pem'));
    },

    /**
     * Returns the primary private key to use for security testing.
     *
     * @returns {Object!} The primary private key to use for security testing.
     */
    getPrivateKey() {
        return fs.readFileSync(path.join(__dirname, '../test-keys/private-key.pem'));
    },

    /**
     * Returns the primary public key to use for security testing.
     *
     * @returns {Object!} The primary public key to use for security testing.
     */
    getPublicKey() {
        return fs.readFileSync(path.join(__dirname, '../test-keys/public-key.pem'));
    },
};
