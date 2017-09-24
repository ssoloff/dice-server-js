/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const { defineSupportCode } = require('cucumber')
const driver = require('./driver')

defineSupportCode(({AfterAll, Before}) => {
  Before(function (testCase, callback) {
    this.homePage = this.createHomePage()
    this.resultRowCount = 0
    callback()
  })

  AfterAll(callback => {
    driver.quit().then(callback)
  })
})
