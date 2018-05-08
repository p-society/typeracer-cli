// Getting quote
const chalk = require('chalk')
const onlinegame = require('../scripts/onlinegame')
let _socket, para, username

/**
* @function socket
*/

function socket () {
  const socketClient = require('socket.io-client')

  _socket = socketClient('https://gaudy-cement.glitch.me/', {
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
  username = data.username
  const stdin = process.stdin
  const stdout = process.stdout
  /**
  * Connection event
  * @event connect
  */

  _socket.on('connect', function () {
    stdout.write('\u001B[2J\u001B[0;0f')
    stdout.write(`${username} your connection is established\n`)
    stdout.write('Waiting for others to join...\n')
  })

  // sending room to join for race

  _socket.emit('roomNumber', data.roomNumber)

  // setting paragraph to emit

  _socket.on('paragraph', function (val) {
    para = val

    stdout.write('\u001B[2J\u001B[0;0f')
    stdout.write('All users joined Press Ctrl + r to start the race')
    stdin.setRawMode(true)
    stdin.resume()
    require('readline').emitKeypressEvents(stdin)
    stdin.on('keypress', beforeGame)
  })

  // Sending join message

  _socket.on('joinMessage', function (val) {
    console.log(chalk.green(val.message))
  })

  // Sending leave message

  _socket.on('disconnectMessage', function (val) {
    console.log(chalk.blue('\n' + val))
  })

  // Emitting client info on joining the room

  _socket.on('room', function (val) {
    _socket.emit('join', {roomName: val.value, username: data.username, number: data.number, randomNumber: data.randomNumber})
  })

  // Sending error message to client
  _socket.on('err', function (val) {
    console.log(chalk.red(val.message))
    process.exit()
  })

  _socket.on('score', function (val) {
    stdout.write('\u001B[2J\u001B[0;0f')
    val.forEach((result) => {
      console.log(chalk.cyan(`\n${result.username} completed with speed of ${result.score}`))
    })
    console.log(chalk.green('\nYou are smart enough to guess the winner.\nPress Ctrl + c to exit the game'))
    console.log(chalk.cyan('\nPress Ctrl + f to request a rematch'))

    // Showing message to request rematch

    _socket.on('requestRematch', function (val) {
      process.stdout.write('\u001B[2J\u001B[0;0f')
      console.log(val.message)
      console.log('\nPress Ctrl + y to accept\n Ctrl + c to quit')
    })

    // Showing accepted request

    _socket.on('requestRematchaccepted', function (val) {
      console.log(val.message)
    })
  })
}

/**
* @function beforeGame
* @param {String} chunk
* @param {Object} key
*/

function beforeGame (chunk, key) {
  if (key.ctrl === true && key.name === 'r') {
    process.stdout.write('\u001B[2J\u001B[0;0f')
    onlinegame(para, _socket, username)
  } else if (key.ctrl && key.name === 'c') {
    process.exit()
  } else if (key.ctrl && key.name === 'f') {
    process.stdout.write('\u001B[2J\u001B[0;0f')
    console.log('Waiting for response..')
    _socket.emit('rematch', {username: username})
  } else if (key.ctrl && key.name === 'y') {
    _socket.emit('accepted', {username: username})
    onlinegame(para, _socket, username)
  }
}

module.exports = online
