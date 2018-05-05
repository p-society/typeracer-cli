// Getting quote
const quote = require('../scripts/paragraph')

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
    process.stdout.write(`${username} connected`)
  })
}

module.exports = online
