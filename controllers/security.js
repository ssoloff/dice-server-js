/*
 * Copyright (c) 2015 Steven Soloff
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
var jws = require('jws');

var SIGNATURE_ALGORITHM = 'RS256';

function toString(obj) {
    if (typeof obj === 'string') {
        return obj;
    } else if (typeof obj === 'number' || Buffer.isBuffer(obj)) {
        return obj.toString();
    } else {
        return JSON.stringify(obj);
    }
}

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
     *
     * @returns {Object!} The detached JSON web signature.
     */
    createSignature: function (payload, privateKey) {
        var jwsSignature = jws.sign({
            header: {
                alg: SIGNATURE_ALGORITHM
            },
            payload: payload,
            privateKey: privateKey
        });
        var decodedJwsSignature = jws.decode(jwsSignature);
        return {
            protected: base64url.encode(JSON.stringify(decodedJwsSignature.header)),
            signature: decodedJwsSignature.signature
        };
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
     * @param {Object!} payload - The payload.  If not a buffer or a string,
     *      it will be coerced to a string using `JSON.stringify`.
     * @param {Object!} publicKey - A string or a buffer containing the
     *      public key.
     * @param {Object!} signature - The detached JSON web signature to be
     *      verified for the specified payload.
     *
     * @returns {Boolean!} `true` if the signature is valid; otherwise `false`.
     */
    verifySignature: function (payload, publicKey, signature) {
        var jwsSignature = signature.protected +
            '.' +
            base64url.encode(toString(payload)) +
            '.' +
            signature.signature;
        return jws.verify(jwsSignature, SIGNATURE_ALGORITHM, publicKey);
    }
};

