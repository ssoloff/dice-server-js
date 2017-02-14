/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const fs = require('fs')
const security = require('../../../src/server/util/security')
const securityTest = require('../test-support/security-test')

describe('security', () => {
  let payload,
    privateKey,
    publicKey

  beforeEach(() => {
    payload = {
      a: 1,
      b: 2,
      c: 3
    }

    privateKey = securityTest.getPrivateKey()
    publicKey = securityTest.getPublicKey()
  })

  describe('.createSignature', () => {
    it(
      'should return a signature object using flattened JWS JSON serialization syntax with no unprotected header ' +
        'and no payload',
      () => {
        const signature = security.createSignature(payload, privateKey, publicKey)

        expect(signature.protected).toMatch(/^[-_0-9A-Za-z]+$/)
        expect(signature.signature).toMatch(/^[-_0-9A-Za-z]+$/)
        expect(signature.header).not.toBeDefined()
        expect(signature.payload).not.toBeDefined()
      }
    )
  })

  describe('.getKey', () => {
    const KEY_ENV_CONTENT = 'keyThatCameFromEnv'
    const KEY_FILE_CONTENT = 'keyThatCameFromFile'
    const KEY_FILE_NAME = 'keyFileName'
    const KEY_TYPE = 'keyType'

    beforeEach(() => {
      spyOn(fs, 'readFileSync').and.returnValue(KEY_FILE_CONTENT)
    })

    describe('when key specified via file', () => {
      it('should read the key from the file', () => {
        expect(security.getKey(KEY_TYPE, KEY_FILE_NAME, undefined)).toBe(KEY_FILE_CONTENT)
      })
    })

    describe('when key specified via environment', () => {
      it('should read the key from the environment', () => {
        expect(security.getKey(KEY_TYPE, undefined, KEY_ENV_CONTENT)).toBe(KEY_ENV_CONTENT)
      })
    })

    describe('when key specified via both file and environment', () => {
      it('should read the key from the file', () => {
        expect(security.getKey(KEY_TYPE, KEY_FILE_NAME, KEY_ENV_CONTENT)).toBe(KEY_FILE_CONTENT)
      })
    })

    describe('when key not specified', () => {
      it('should throw exception', () => {
        expect(() => {
          security.getKey(KEY_TYPE, undefined, undefined)
        }).toThrowError(`${KEY_TYPE} key not specified`)
      })
    })
  })

  describe('.toCanonicalString', () => {
    describe('when object is a string', () => {
      it('should return the object', () => {
        expect(security.toCanonicalString('test')).toBe('test')
      })
    })

    describe('when object is a number', () => {
      it('should return the object as a string', () => {
        expect(security.toCanonicalString(42)).toBe('42')
      })
    })

    describe('when object is a buffer', () => {
      it('should return the object as a string using UTF-8 encoding', () => {
        expect(security.toCanonicalString(Buffer.from('test'))).toBe('test')
      })
    })

    describe('when object is anything else', () => {
      it('should return the object as a canonical JSON string', () => {
        const obj = {
          c: 3,
          a: 1,
          b: 2
        }

        expect(security.toCanonicalString(obj)).toBe('{"a":1,"b":2,"c":3}')
      })
    })
  })

  describe('.verifySignature', () => {
    describe('when signature is valid', () => {
      it('should return true', () => {
        const signature = security.createSignature(payload, privateKey, publicKey)

        const isValid = security.verifySignature(payload, signature)

        expect(isValid).toBe(true)
      })
    })

    describe('when signature is not valid', () => {
      it('should return false', () => {
        const signature = security.createSignature(payload, privateKey, publicKey)
        payload.a = -payload.a // Simulate attacker modifying payload

        const isValid = security.verifySignature(payload, signature)

        expect(isValid).toBe(false)
      })
    })

    describe('when public key is specified', () => {
      it('should use the specified public key instead of the public key in the signature', () => {
        const otherPublicKey = securityTest.getOtherPublicKey()
        const signature = security.createSignature(payload, privateKey, publicKey)

        const isValid = security.verifySignature(payload, signature, otherPublicKey)

        expect(isValid).toBe(false)
      })
    })
  })
})
