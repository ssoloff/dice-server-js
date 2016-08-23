/*
 * Copyright (c) 2016 Steven Soloff
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var base64url = require('base64url');
var canonicalJsonStringify = require('canonical-json');
var jwkToPem = require('jwk-to-pem');
var jws = require('jws');
var rsaPemToJwk = require('rsa-pem-to-jwk');

var SIGNATURE_ALGORITHM = 'RS256';

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
    createSignature: function (payload, privateKey, publicKey) {
        var canonicalPayload,
            decodedJwsSignature,
            jwsSignature;

        canonicalPayload = this.toCanonicalString(payload);
        jwsSignature = jws.sign({
            header: {
                alg: SIGNATURE_ALGORITHM,
                jwk: rsaPemToJwk(publicKey, {alg: SIGNATURE_ALGORITHM, key_ops: 'verify', use: 'sig'})
            },
            payload: canonicalPayload,
            privateKey: privateKey
        });
        decodedJwsSignature = jws.decode(jwsSignature);
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
    toCanonicalString: function (obj) {
        if (typeof obj === 'string') {
            return obj;
        } else if (typeof obj === 'number' || Buffer.isBuffer(obj)) {
            return obj.toString();
        } else {
            return canonicalJsonStringify(obj);
        }
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
    verifySignature: function (payload, signature, publicKey) {
        var canonicalPayload,
            decodedProtectedHeader,
            jwsSignature;

        canonicalPayload = this.toCanonicalString(payload);
        jwsSignature = signature.protected +
            '.' +
            base64url.encode(canonicalPayload) +
            '.' +
            signature.signature;
        decodedProtectedHeader = JSON.parse(base64url.decode(signature.protected));
        publicKey = publicKey || jwkToPem(decodedProtectedHeader.jwk);
        return jws.verify(jwsSignature, SIGNATURE_ALGORITHM, publicKey);
    }
};
