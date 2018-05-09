/**
* Requiring modules and files
*/

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const para = require('../paragraphs/para')
let quote, randomNumber
let arr = []
const paras = require('../paragraphs/para')
/**
* @function randomNumRetry
*/

function randomNumRetry() {
  randomNumber = Math.floor((Math.random() * paras.length))
  quote = paras[randomNumber].para
  if (quote.length < 100) {
    quote = paras[randomNumber].para + ' ' + paras[randomNumber - 1].para
  }
  return quote
}

/**
* Socket.io configurations
*/

io.on('connection', function (client) {
  let room = function (value) {
    client.join(value)

    client.emit('room', {value: value})
  }

  /** Getting info when client joins
  * @event join
  * @function
  * @param {Object} val
  */

  client.on('join', function (val) {
    const countUser = io.sockets.adapter.rooms[val.roomName].length

    // Sending join message to everyone in room except client who joins

    client.to(val.roomName).emit('joinMessage', {message: `${val.username} joined`})

    // Sending message to everyone if client leaves the room

    client.on('disconnect', () => {
      arr = []
      client.to(val.roomName).emit('disconnectMessage', `${val.username} left`)
    })

    // Sending score to everyone when game ends
    client.on('end', function (result) {
      arr.push(result)
      console.log(arr)
      if (arr.length === io.sockets.adapter.rooms[val.roomName].length) {
        io.in(val.roomName).emit('score', arr)
        arr = []
      }

      client.on('rematch', function (result) {
        arr = []
        client.to(val.roomName).emit('requestRematch', {message: `${result.username} requested a rematch`})
      })

      client.on('accepted', function (result) {
        client.to(val.roomName).emit('requestRematchaccepted', {message: `${result.username} accepted rematch press Ctrl + g`})
      })

      client.on('randomPara', function (result) {
        client.to(client.id).emit('tempPara', {paragraph : result.para})
      })
    })

    if (val.number && (Number(val.number) === countUser)) {
      io.in(val.roomName).emit('paragraph', randomNumRetry())
    } else if (countUser > Number(val.number)) {
      client.emit('err', {message: `Sorry ${val.number} users are already playing the game`})
      client.disconnect(true)
    }
  })

  client.on('roomNumber', room)
})

/**
* Starting server
*/

server.listen(port)

module.exports = app
