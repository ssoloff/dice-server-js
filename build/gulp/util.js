/*
 * Copyright (c) 2015-2017 Steven Soloff
 *
 * This is free software: you can redistribute it and/or modify it under the
 * terms of the MIT License (https://opensource.org/licenses/MIT).
 * This software comes with ABSOLUTELY NO WARRANTY.
 */

'use strict'

const childProcess = require('child_process')
const dirs = require('./dirs')

function compilePath (path) {
  let compilePath = dirs.compile
  if (path) {
    compilePath += `/${path}`
  }
  return compilePath
}

function exec (command) {
  return new Promise((resolve, reject) => {
    const child = childProcess.exec(command, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
    child.stdout.on('data', (data) => {
      process.stdout.write(data)
    })
    child.stderr.on('data', (data) => {
      process.stderr.write(data)
    })
  })
}

module.exports = {
  compilePath: compilePath,
  exec: exec
}
