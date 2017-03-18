/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const createApp = require('../../src/server/app')
const finishTest = require('jasmine-supertest')
const request = require('supertest')
const serviceTest = require('./test-support/service-test')

describe('app', () => {
  const agent = request(createApp({
    privateKey: serviceTest.getPrivateKey(),
    publicKey: serviceTest.getPublicKey()
  }))

  describe('middleware', () => {
    it('should echo request ID as correlation ID', (done) => {
      const requestId = 'aaaaa-bbbbb-ccccc-ddddd'

      agent
        .post('/api/expression/evaluate')
        .set('X-Request-ID', requestId)
        .send({
          expression: {
            text: '1+2'
          }
        })
        .expect('X-Correlation-ID', requestId)
        .end(finishTest(done))
    })
  })

  describe('api', () => {
    it('should route an evaluate expression request', (done) => {
      agent
        .post('/api/expression/evaluate')
        .send({
          expression: {
            text: '1+2'
          }
        })
        .expect(200)
        .expect((response) => {
          const body = response.body
          expect(body.expression.text).toBe('1+2')
          expect(body.expressionResult.value).toBe(3)
        })
        .end(finishTest(done))
    })

    it('should route a ticket workflow', (done) => {
      agent
        .post('/api/ticket/issue')
        .send({
          description: 'description',
          evaluateExpressionRequestBody: {
            expression: {
              text: '1+2'
            }
          }
        })
        .expect(200)
        .then((response) => {
          agent
            .post('/api/ticket/redeem')
            .send(response.body)
            .expect(200)
            .expect((response) => {
              const evaluateExpressionResponseBody = response.body.redeemedTicket.content.evaluateExpressionResponseBody
              expect(evaluateExpressionResponseBody.expression.text).toBe('1+2')
              expect(evaluateExpressionResponseBody.expressionResult.value).toBe(3)
            })
            .then((response) => {
              agent
                .post('/api/ticket/validate-redeemed')
                .send(response.body)
                .expect(200)
                .end(finishTest(done))
            })
        })
    })
  })
})
