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

// Setting modules to use
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Getting router and setting them
app.use('/', routes)

/**
* Socket.io configurations
*/
let clientCounter = 0

io.on('connection', function (client) {
  clientCounter++
  // limiting to 5 people race only
  if (clientCounter > 1) {
    --clientCounter
    client.emit('err', { message : "Reached maximum of 5 people in 1 race"})
    client.disconnect(true)
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
