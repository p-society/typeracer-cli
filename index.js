#!/usr/bin/env node

/**
* Module dependencies
*/

// Requiring readline Module of nodejs

var rl = require('readline')

// Creating an interface for reading line from console

rl.createInterface({
  input: process.stdin,
  output: process.stdout
})

let arr = []

/**
* @event {String} keypress
* Listening to keypess and storing in array to compare with the word
*/

process.stdin.on('keypress', function (data, chunk, key) {
  const a = JSON.stringify(chunk)
  if (chunk.name !== 'space' && chunk.ctrl === false) {
    arr.push(chunk.sequence)
    // stringArr will have whole word which we are comparing
    const stringArr = arr.join('')
  } else if (chunk.name === 'space') { // Clear array for new word
    arr = []
  }
})
