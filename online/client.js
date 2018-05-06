// Getting quote
const quote = require('../scripts/paragraph')
const chalk = require('chalk')
const logUpdate = require('log-update')
const game = require('../scripts/game')

/**
* @function online
* @param {Object} data
*/

function online (data) {
  const socketClient = require('socket.io-client')
  let _socket

  _socket = socketClient('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 2
  })
    let username = data.username

  /**
  * Connection event
  * @event connect
  */

  _socket.on('connect', function () {
    const stdin = process.stdin
    const stdout = process.stdout
    stdin.setRawMode(true)
    stdin.resume()
    require('readline').emitKeypressEvents(stdin)
    stdin.on('keypress', beforeGame)
    console.log(`${username} your connection is established\n Press Enter to start\n`)
  })

  _socket.on('err', function (val) {
    console.log(chalk.red(val.message))
    process.exit()
  })
}

/**
* @function beforeGame
* @param {String} chunk
* @param {Object} key
*/

function beforeGame(chunk, key) {
  if(key.sequence === '\r' && key.name === 'return') {
    console.log('Waiting....')
  } else if (key.ctrl && key.name === 'c') {
    process.exit()
  }
}

module.exports = online
