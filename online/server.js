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

io.on('connection', function (client) {
  console.log('Client connected...')
})

/**
* Starting server
*/

server.listen(port)
