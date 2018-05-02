// Requiring readline Module of nodejs
const rl = require('readline')
const para = require('../paragraphs/para')

// Generating a random paragraph
const random = Math.floor((Math.random()* para.length))
const paraRandom = para[random].para

const splitPara = paraRandom.split('')

// Creating an interface for reading line from console

rl.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

function game () {

  let arr = []
  let stringArr

  /**
  * @event {String} keypress
  * Listening to keypess and storing in array to compare with the word
  */

  process.stdin.on('keypress', function (data, chunk, key) {

    if (chunk.name !== 'space' && chunk.ctrl === false && chunk.name !== 'backspace') {

      arr.push(chunk.sequence)
      // stringArr will have whole word which we are comparing
      stringArr = arr.join('')
    } else if (chunk.name === 'space') { // Clear array for new word
      arr = []
    }
  })

}

module.exports = game
