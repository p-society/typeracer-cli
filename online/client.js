// Getting quote
const quote = require('../scripts/paragraph')
const chalk = require('chalk')
const logUpdate = require('log-update')
const game = require('../scripts/game')
let _socket
let para

/**
* @function socket
*/

function socket() {
  const socketClient = require('socket.io-client')

  _socket = socketClient('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 2
  })
  return _socket
}

/**
* @function online
* @param {Object} data
*/

function online (data) {

  socket()
  let username = data.username

  /**
  * Connection event
  * @event connect
  */

  _socket.on('connect', function () {
    const stdin = process.stdin
    const stdout = process.stdout
    stdout.write('\u001B[2J\u001B[0;0f')
    stdin.setRawMode(true)
    stdin.resume()
    require('readline').emitKeypressEvents(stdin)
    stdin.on('keypress', beforeGame)
    console.log(`${username} your connection is established\n Press Enter to start\n`)
  })

  // sending room to join for race

  _socket.emit('roomNumber', data.roomNumber)

  // Sending number of players

  _socket.emit('people', data.number)

  // setting paragraph to emit

  _socket.on('paragraph', function(val){
    para = val
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
    process.stdout.write('\u001B[2J\u001B[0;0f')
    console.log(para)
  } else if (key.ctrl && key.name === 'c') {
    process.exit()
  }
}

module.exports = online
