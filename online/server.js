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
let clientCounter = 0
let people, channel

io.on('connection', function (client) {
  // Listen to people event from client
  client.on('people', function(val){
    people = val
  })

  console.log(people)

  // listen to room event form client

  client.on('roomNumber', function(val){
    roomNumber = val
    client.join(val)
  })

  clientCounter++
  // limiting to 5 people race only
  if (clientCounter > 3) {
    --clientCounter
    client.emit('err', { message : "Reached maximum of 5 people in 1 race"})
    client.disconnect(true)
  }

  // Send only when all are connected

  else if(clientCounter === people) {
    // Sending paragraph to everyone
    io.to(channel).emit('paragraph', quote)
  }

  client.on('disconnect',()=>{
    clientCounter--
    console.log(`${client.id} disconnected`)
  })
})

/**
* Starting server
*/

server.listen(port)
