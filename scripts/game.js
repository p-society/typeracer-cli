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
let Mistakes = 0
let onMistake = false

// Generating a random paragraph
const random = Math.floor((Math.random()* para.length))
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

function keypress(chunk,key) {
  if(key.ctrl && key.name === 'c') {
    process.exit()
  }
  if(key && key.name === 'backspace') {
    if (stringTyped.length === 0) return
    stringTyped = stringTyped.slice(0, -1)
  }
  else if (stringTyped.length < quote.length) {
		stringTyped += chunk
	}
  updateColor()
}

/**
* @function updateColor
*/

function updateColor() {
  let updatedString = color(quote, stringTyped)
  updatedString += quote.slice(stringTyped.length, quote.length)
  logUpdate(
`${updatedString}`)
}

/**
* @function color
* @param {String} quote
* @param {String} stringTyped
*/

function color(quote, stringTyped) {
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
				finished = true
			}
		} else {
			wrongInput = true
			colouredString += chalk.red(quoteLetters[i])
		}
	}
	return colouredString
}

/**
* @function update
*/

function update() {
	let countedMistakes = 0
	for (let i = 0; i < stringTyped.length; i++) {
		if (stringTyped[i] !== quote[i]) {
			countedMistakes++
			if (!onMistake) {
				onMistake = true
				Mistakes++
			}
		}
	}

	if (countedMistakes === 0) {
		onMistake = false
	}
}

/**
* @function game
*/

function game () {
  stdin.on('keypress', keypress)
  update()
}

module.exports = game
