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

describe('security', () => {
  let payload;
  let privateKey;
  let publicKey;

  beforeEach(() => {
    payload = {
      a: 1,
      b: 2,
      c: 3,
    };

    privateKey = securityTest.getPrivateKey();
    publicKey = securityTest.getPublicKey();
  });

  describe('.createSignature', () => {
    it(
      'should return a signature object using flattened JWS JSON serialization syntax with no unprotected header ' +
        'and no payload',
      () => {
        const signature = security.createSignature(payload, privateKey, publicKey);

        expect(signature.protected).toMatch(/^[-_0-9A-Za-z]+$/);
        expect(signature.signature).toMatch(/^[-_0-9A-Za-z]+$/);
        expect(signature.header).not.toBeDefined();
        expect(signature.payload).not.toBeDefined();
      }
    );
  });

  describe('.toCanonicalString', () => {
    describe('when object is a string', () => {
      it('should return the object', () => {
        expect(security.toCanonicalString('test')).toBe('test');
      });
    });

    describe('when object is a number', () => {
      it('should return the object as a string', () => {
        expect(security.toCanonicalString(42)).toBe('42');
      });
    });

    describe('when object is a buffer', () => {
      it('should return the object as a string using UTF-8 encoding', () => {
        expect(security.toCanonicalString(new Buffer('test'))).toBe('test');
      });
    });

    describe('when object is anything else', () => {
      it('should return the object as a canonical JSON string', () => {
        const obj = {
          c: 3,
          a: 1,
          b: 2,
        };

        expect(security.toCanonicalString(obj)).toBe('{"a":1,"b":2,"c":3}');
      });
    });
  });

  describe('.verifySignature', () => {
    describe('when signature is valid', () => {
      it('should return true', () => {
        const signature = security.createSignature(payload, privateKey, publicKey);

        const isValid = security.verifySignature(payload, signature);

        expect(isValid).toBe(true);
      });
    });

    describe('when signature is not valid', () => {
      it('should return false', () => {
        const signature = security.createSignature(payload, privateKey, publicKey);
        payload.a = -payload.a; // Simulate attacker modifying payload

        const isValid = security.verifySignature(payload, signature);

        expect(isValid).toBe(false);
      });
    });

    describe('when public key is specified', () => {
      it('should use the specified public key instead of the public key in the signature', () => {
        const otherPublicKey = securityTest.getOtherPublicKey();
        const signature = security.createSignature(payload, privateKey, publicKey);

        const isValid = security.verifySignature(payload, signature, otherPublicKey);

        expect(isValid).toBe(false);
      });
    });
  });
});
