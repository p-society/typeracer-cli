/**
* Requiring modules and files
*/

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const para = require('../paragraphs/para')
let quote
let arr = []

/**
* Socket.io configurations
*/

io.on('connection', function (client) {
  let room = function (value) {
    client.join(value)

    client.emit('room', {value: value})
  }

  client.on('join', function (val) {
    const countUser = io.sockets.adapter.rooms[val.roomName].length

    quote = para[val.randomNumber].para
    if (quote.length < 100) {
      quote = para[val.randomNumber].para + ' ' + para[val.randomNumber - 1].para
    }

    client.to(val.roomName).emit('joinMessage', {message: `${val.username} joined`})
    client.on('end', function (result) {
      arr.push(result)
      if (arr.length === io.sockets.adapter.rooms[val.roomName].length) {
        io.in(val.roomName).emit('score', arr)
      }
    })
    if (val.number && (Number(val.number) === countUser)) {
      io.in(val.roomName).emit('paragraph', quote)
    } else if (countUser > Number(val.number)) {
      client.emit('err', {message: `Sorry ${val.number} users are already playing the game`})
      client.disconnect(true)
    }
  })

  client.on('roomNumber', room)

  client.on('disconnect', () => {
    console.log(`${client.id} disconnected`)
  })
})

/**
* Starting server
*/

server.listen(port)
