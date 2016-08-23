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

var fs = require('fs');
var path = require('path');
var security = require('../../../../app/controllers/support/security');

describe('security', function () {
    var payload,
        privateKey,
        publicKey;

    beforeEach(function () {
        payload = {
            a: 1,
            b: 2,
            c: 3
        };

        privateKey = fs.readFileSync(path.join(__dirname, '../../../../test/private-key.pem'));
        publicKey = fs.readFileSync(path.join(__dirname, '../../../../test/public-key.pem'));
    });

    describe('.createSignature', function () {
        it('should return a signature object using flattened JWS JSON serialization syntax with no unprotected header and no payload', function () {
            var signature;

            signature = security.createSignature(payload, privateKey, publicKey);

            expect(signature.protected).toMatch(/^[-_0-9A-Za-z]+$/);
            expect(signature.signature).toMatch(/^[-_0-9A-Za-z]+$/);
            expect(signature.header).not.toBeDefined();
            expect(signature.payload).not.toBeDefined();
        });
    });

    describe('.toCanonicalString', function () {
        describe('when object is a string', function () {
            it('should return the object', function () {
                expect(security.toCanonicalString('test')).toBe('test');
            });
        });

        describe('when object is a number', function () {
            it('should return the object as a string', function () {
                expect(security.toCanonicalString(42)).toBe('42');
            });
        });

        describe('when object is a buffer', function () {
            it('should return the object as a string using UTF-8 encoding', function () {
                expect(security.toCanonicalString(new Buffer('test'))).toBe('test');
            });
        });

        describe('when object is anything else', function () {
            it('should return the object as a canonical JSON string', function () {
                var obj = {
                    c: 3,
                    a: 1,
                    b: 2
                };

                expect(security.toCanonicalString(obj)).toBe('{"a":1,"b":2,"c":3}');
            });
        });
    });

    describe('.verifySignature', function () {
        describe('when signature is valid', function () {
            it('should return true', function () {
                var isValid,
                    signature;

                signature = security.createSignature(payload, privateKey, publicKey);

                isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(true);
            });
        });

        describe('when signature is not valid', function () {
            it('should return false', function () {
                var isValid,
                    signature;

                signature = security.createSignature(payload, privateKey, publicKey);
                payload.a = -payload.a; // simulate attacker modifying payload

                isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(false);
            });
        });

        describe('when public key is specified', function () {
            it('should use the specified public key instead of the public key in the signature', function () {
                var isValid,
                    otherPublicKey,
                    signature;

                otherPublicKey = fs.readFileSync(path.join(__dirname, '../../../../test/other-public-key.pem'));
                signature = security.createSignature(payload, privateKey, publicKey);

                isValid = security.verifySignature(payload, signature, otherPublicKey);

                expect(isValid).toBe(false);
            });
        });
    });
});
