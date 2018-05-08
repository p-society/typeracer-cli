/**
* Module dependencies and files from other folders
*/
const chalk = require('chalk')
const logUpdate = require('log-update')
const para = require('../paragraphs/para')
const randomNumber = require('./paragraph')
const {prompt} = require('inquirer')
let quote
quote = para[randomNumber].para
if (quote.length < 100) {
  quote = para[randomNumber].para + ' ' + para[randomNumber - 1].para
}

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

// setting questions for retry

const question1 = [{
  type: 'list',
  name: 'whatdo',
  message: 'What do you want to do?',
  choices: [
    'Retry',
    'Exit'
  ]
}]

// To clear the terminal
stdout.on('resize', () => {
  stdout.write('\u001B[2J\u001B[0;0f')
  updateColor()
})

/**
* @function keypress
* @param {Object} chunk
* @param {String} key
*/

function keypress (chunk, key) {
  if (key.ctrl && key.name === 'c') {
    stdout.write('\n')
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
  // Clearing the terminal for double time error

  stdout.write('\u001B[2J\u001B[0;0f')

  let updatedString = color(quote, stringTyped)
  updatedString += quote.slice(stringTyped.length, quote.length)
  let timeColour = 'cyan'
  let wordsPerminColor = 'cyan'
  if (wordsPermin < 30) {
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
      colouredString += chalk.bgRed(quoteLetters[i])
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
      colouredString += chalk.bgRed(quoteLetters[i])
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
  prompt(question1).then(answers => {
    switch (answers.whatdo) {
      case 'Retry':
        game()
        break
      case 'Exit':
        process.exit()
      default:
        process.exit()
    }
  })
}

/**
* @function game
*/

function game () {
  stdout.write('\u001B[2J\u001B[0;0f')
  gameEnd = false
  stringTyped = ''
  timeStarted = Date.now() + 5000
  wordsPermin = 0
  let startColor = 'yellowBright'
  // Game Start
  const startinterval = setInterval(() => {
    const timeInterval = (Math.round((Date.now() - timeStarted) / 1000 * 10) / 10)
    logUpdate(`\nGame Starting in ${chalk[startColor](timeInterval)} sec`)
    if (timeInterval === 0) {
      clearInterval(startinterval)
      // displaying the quote
      stdout.write('\u001B[2J\u001B[0;0f')
      stdout.write(quote)
      // Moving cursor to start
      stdout.cursorTo(0)

      stdin.on('keypress', keypress)
      stdin.setRawMode(true)
      stdin.resume()
    }
  }, 1000)

  // After game starts

  const interval = setInterval(() => {
    if (gameEnd) {
      gameEnded()
      clearInterval(interval)
    } else {
      Time()
      updateWpm()
    }
  }, 1000)
}

module.exports = game
