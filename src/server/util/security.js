/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const base64url = require('base64url');
const canonicalJsonStringify = require('canonical-json');
const jwkToPem = require('jwk-to-pem');
const jws = require('jws');
const rsaPemToJwk = require('rsa-pem-to-jwk');

const SIGNATURE_ALGORITHM = 'RS256';

module.exports = {
    /**
     * Creates a detached JSON web signature for the specified payload.
     *
     * <p>
     * The returned JSON web signature uses the flattened JWS JSON
     * serialization.  It does not include the payload as it is a
     * detached signature.
     * </p>
     *
     * @param {Object!} payload - The payload.  If not a buffer or a string,
     *      it will be coerced to a string using `JSON.stringify`.
     * @param {Object!} privateKey - A string or a buffer containing the
     *      private key.
     * @param {Object!} publicKey - A string or a buffer containing the public
     *      key.
     *
     * @returns {Object!} The detached JSON web signature.
     */
    createSignature(payload, privateKey, publicKey) {
        const canonicalPayload = this.toCanonicalString(payload);
        const jwsSignature = jws.sign({
            header: {
                alg: SIGNATURE_ALGORITHM,
                jwk: rsaPemToJwk(publicKey, {alg: SIGNATURE_ALGORITHM, key_ops: 'verify', use: 'sig'})
            },
            payload: canonicalPayload,
            privateKey: privateKey
        });
        const decodedJwsSignature = jws.decode(jwsSignature);
        return {
            protected: base64url.encode(JSON.stringify(decodedJwsSignature.header)),
            signature: decodedJwsSignature.signature
        };
    },

    /**
     * Converts the specified object to a canonical string for use in
     * calculating a reproducible signature.
     *
     * @param {Object!} obj - The object to be converted.
     *
     * @returns {String!} The canonical string representation of the specified
     *      object.
     */
    toCanonicalString(obj) {
        if (typeof obj === 'string') {
            return obj;
        }

        if (typeof obj === 'number' || Buffer.isBuffer(obj)) {
            return obj.toString();
        }

        return canonicalJsonStringify(obj);
    },

    /**
     * Verifies a detached JSON web signature for the specified payload.
     *
     * <p>
     * The specified JSON web signature uses the flattened JWS JSON
     * serialization.  It does not include the payload as it is a
     * detached signature.
     * </p>
     *
     * <p>
     * The current implementation does not validate the certificate chain.
     * Therefore, until such certificate chain validation is implemented, you
     * should explicitly pass the public key used to verify the signature to
     * ensure you are not receiving a forged payload and/or protected header.
     * </p>
     *
     * @param {Object!} payload - The payload.  If not a buffer or a string,
     *      it will be coerced to a string using `JSON.stringify`.
     * @param {Object!} signature - The detached JSON web signature to be
     *      verified for the specified payload.
     * @param {Object} publicKey - A string or buffer containing the public key
     *      used to verify the signature.  If not specified, the public key
     *      embedded in the web signature will be used to verify the signature.
     *
     * @returns {Boolean!} `true` if the signature is valid; otherwise `false`.
     */
    verifySignature(payload, signature, publicKey) {
        const canonicalPayload = this.toCanonicalString(payload);
        const jwsSignature = signature.protected +
            '.' +
            base64url.encode(canonicalPayload) +
            '.' +
            signature.signature;
        const decodedProtectedHeader = JSON.parse(base64url.decode(signature.protected));
        publicKey = publicKey || jwkToPem(decodedProtectedHeader.jwk);
        return jws.verify(jwsSignature, SIGNATURE_ALGORITHM, publicKey);
    }
};
