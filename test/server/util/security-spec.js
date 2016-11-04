/*
 * Copyright (c) 2016 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict';

const security = require('../../../src/server/util/security');
const securityTest = require('../test-support/security-test');

describe('security', function () {
    let payload;
    let privateKey;
    let publicKey;

    beforeEach(function () {
        payload = {
            a: 1,
            b: 2,
            c: 3
        };

        privateKey = securityTest.getPrivateKey();
        publicKey = securityTest.getPublicKey();
    });

    describe('.createSignature', function () {
        it('should return a signature object using flattened JWS JSON serialization syntax with no unprotected header and no payload', function () {
            const signature = security.createSignature(payload, privateKey, publicKey);

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
                const obj = {
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
                const signature = security.createSignature(payload, privateKey, publicKey);

                const isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(true);
            });
        });

        describe('when signature is not valid', function () {
            it('should return false', function () {
                const signature = security.createSignature(payload, privateKey, publicKey);
                payload.a = -payload.a; // simulate attacker modifying payload

                const isValid = security.verifySignature(payload, signature);

                expect(isValid).toBe(false);
            });
        });

        describe('when public key is specified', function () {
            it('should use the specified public key instead of the public key in the signature', function () {
                const otherPublicKey = securityTest.getOtherPublicKey();
                const signature = security.createSignature(payload, privateKey, publicKey);

                const isValid = security.verifySignature(payload, signature, otherPublicKey);

                expect(isValid).toBe(false);
            });
        });
    });
});
