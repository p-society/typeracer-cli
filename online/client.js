// Getting quote
const quote = require('../scripts/paragraph')
const chalk = require('chalk')
const logUpdate = require('log-update')
const game = require('../scripts/game')

/**
* @function online
*/

function online (data) {
  const socketClient = require('socket.io-client')
  let _socket
  let connections = 5

  _socket = socketClient('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 1
  })
    let username = data.username
  _socket.on('connect', function () {
    console.log(`${username} your connection is established\n`)
    const stdin = process.stdin
    const stdout = process.stdout
    stdin.setRawMode(true)
    stdin.resume()
    require('readline').emitKeypressEvents(stdin)
    game()
  })
}

module.exports = online
