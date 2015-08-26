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

var fs = require('fs');
var path = require('path');
var security = require('../../controllers/security');

describe('security', function () {
    var payload;
    var privateKey;
    var publicKey;

    beforeEach(function () {
        payload = {
            a: 1,
            b: 2,
            c: 3
        };

        privateKey = fs.readFileSync(path.join(__dirname, '../../test/private-key.pem'));
        publicKey = fs.readFileSync(path.join(__dirname, '../../test/public-key.pem'));
    });

    describe('.createSignature', function () {
        it('should return a signature object using flattened JWS JSON serialization syntax with no unprotected header and no payload', function () {
            var signature = security.createSignature(payload, privateKey, publicKey);

            expect(signature.protected).toMatch(/^[-_0-9A-Za-z]+$/);
            expect(signature.signature).toMatch(/^[-_0-9A-Za-z]+$/);
            expect(signature.header).not.toBeDefined();
            expect(signature.payload).not.toBeDefined();
        });
    });

    describe('.toString', function () {
        describe('when object is a string', function () {
            it('should return the object', function () {
                expect(security.toString('test')).toBe('test');
            });
        });

        describe('when object is a number', function () {
            it('should return the object as a string', function () {
                expect(security.toString(42)).toBe('42');
            });
        });

        describe('when object is a buffer', function () {
            it('should return the object as a string using UTF-8 encoding', function () {
                expect(security.toString(new Buffer('test'))).toBe('test');
            });
        });

        describe('when object is anything else', function () {
            it('should return the object as a JSON string', function () {
                expect(security.toString(payload)).toBe('{"a":1,"b":2,"c":3}');
            });
        });
    });

    describe('.verifySignature', function () {
        describe('when signature is valid', function () {
            it('should return true', function () {
                var signature = security.createSignature(payload, privateKey, publicKey);

                var isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(true);
            });
        });

        describe('when signature is not valid', function () {
            it('should return false', function () {
                var signature = security.createSignature(payload, privateKey, publicKey);
                payload.a = -payload.a; // simulate attacker modifying payload

                var isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(false);
            });
        });
    });
});

