/**
* Module dependencies and files from other folders
*/
const chalk = require('chalk')
const logUpdate = require('log-update')
const para = require('../paragraphs/para')

// Creating an interface for reading line from console

const stdin = process.stdin
const stdout = process.stdout
stdin.setRawMode(true)
stdin.resume()
require('readline').emitKeypressEvents(stdin)
let stringTyped = ''
let gameEnd = true
let timeStarted = 0
let time = 0
let wordsPermin = 0
// To clear the terminal
stdout.on('resize', () => {
  stdout.write('\u001B[2J\u001B[0;0f')
  updateColor()
})

// Generating a random paragraph
const random = Math.floor((Math.random() * para.length))
const quote = para[random].para
// displaying the quote
stdout.write(quote)
// Moving cursor to start
stdout.cursorTo(0)

/**
* @function keypress
* @param {Object} chunk
* @param {String} key
*/

function keypress (chunk, key) {
  if (key.ctrl && key.name === 'c') {
    process.exit()
  }
  if (key && key.name === 'backspace') {
    if (stringTyped.length === 0) return
    stringTyped = stringTyped.slice(0, -1)
  } else if (stringTyped.length < quote.length) {
    stringTyped += chunk
  }
  updateColor()
}

/**
* @function updateColor
*/

function updateColor () {
  let updatedString = color(quote, stringTyped)
  updatedString += quote.slice(stringTyped.length, quote.length)
  let timeColour = 'cyan'
  let wordsPerminColor = 'cyan'
  if (wordsPermin < 30 ) {
    wordsPerminColor = 'red'
  }
  logUpdate(
    `${updatedString}
    wordsPermin: ${chalk[wordsPerminColor](Math.round(wordsPermin * 10) / 10)}
    time: ${chalk[timeColour](Math.round(time * 10) / 10)}s`)
}

/**
* @function color
* @param {String} quote
* @param {String} stringTyped
*/

function color (quote, stringTyped) {
  let colouredString = ''
  let wrongInput = false

  const quoteLetters = quote.split('')
  const typedLetters = stringTyped.split('')
  for (let i = 0; i < typedLetters.length; i++) {
    // if a single mistake,
    // the rest of the coloured string will appear red
    if (wrongInput) {
      colouredString += chalk.red(quoteLetters[i])
      continue
    }

    if (typedLetters[i] === quoteLetters[i]) {
      wrongInput = false
      colouredString += chalk.green(quoteLetters[i])
      if (quote === stringTyped) {
        gameEnd = true
      }
    } else {
      wrongInput = true
      colouredString += chalk.red(quoteLetters[i])
    }
  }
  return colouredString
}

/**
* @function Time
*/

function Time () {
  time = (Date.now() - timeStarted) / 1000
}

/**
* @function updateWpm
*/

function updateWpm () {
  if (stringTyped.length > 0) {
    wordsPermin = stringTyped.split(' ').length / (time / 60)
  }
}

/**
* @function gameEnded
*/

function gameEnded () {
  stdin.removeListener('keypress', keypress)
  process.exit(0)
}

/**
* @function game
*/

function game () {
  gameEnd = false
  timeStarted = Date.now()
  stdin.on('keypress', keypress)

  const interval = setInterval(() => {
    if (gameEnd) {
      gameEnded()
      clearInterval(interval)
    } else {
      Time()
      updateWpm()
    }
  }, 100)
}

module.exports = game
