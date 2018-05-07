/**
* Requiring modules and files
*/

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes/routes')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const quote = require('../scripts/paragraph')

// Setting modules to use
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Getting router and setting them
app.use('/', routes)

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

    client.to(val.roomName).emit('joinMessage', {message: `${val.username} joined`})
    client.on('end', function (result) {
      client.to(val.roomName).emit('score', {message: `${result.username} completed race with speed ${result.score}`})
    })
    if (val.number && (Number(val.number) === countUser)) {
      io.in(val.roomName).emit('paragraph', quote)
    } else if (countUser > Number(val.number)) {
      console.log('messi')
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
