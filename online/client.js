// Getting quote
const quote = require('../scripts/paragraph')

/**
* @function online
*/

function online () {
  const socketClient = require('socket.io-client')
  let _socket
  let connections = 5

  _socket = socketClient('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 1
  })

  _socket.on('connect', function () {
    console.log(quote)
  })
}

module.exports = online
