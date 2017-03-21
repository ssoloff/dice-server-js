/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const middleware = require('../../../src/server/middleware')

describe('notFound', () => {
  let notFound
  let req
  let res

  beforeEach(() => {
    notFound = middleware.notFound()
    req = {}
    res = {
      json: jasmine.createSpy('json'),
      send: jasmine.createSpy('send'),
      sendFile: jasmine.createSpy('sendFile'),
      status: jasmine.createSpy('status'),
      type: jasmine.createSpy('type')
    }
    res.type.and.returnValue(res)
  })

  describe('when the request accepts HTML', () => {
    it('should respond with HTML', () => {
      req.accepts = (types) => (types === 'html') ? types : undefined

      notFound(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.sendFile).toHaveBeenCalledWith(jasmine.stringMatching('404.html'))
    })
  })

  describe('when the request accepts JSON', () => {
    it('should respond with JSON', () => {
      req.accepts = (types) => (types === 'json') ? types : undefined

      notFound(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({error: 'Not found'})
    })
  })

  describe('when the request does not specify what it accepts', () => {
    it('should respond with text', () => {
      req.accepts = () => undefined

      notFound(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.type).toHaveBeenCalledWith('text/plain')
      expect(res.send).toHaveBeenCalledWith('Not found')
    })
  })
})
