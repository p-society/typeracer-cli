/**
* Requiring modules and files
*/
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let quote, randomNumber
let arr = []
const paras = require('../paragraphs/para')
const mongoose = require('mongoose')
const Score = require('./scoreSchema')
const chalk = require('chalk')

/**
* Mongodb connection
*/

mongoose.connect(process.env.DATABASE)
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to database')
})
mongoose.connection.on('error', (err) => {
  console.log(err)
})

/**
* @function randomNumRetry
*/

function randomNumRetry () {
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
  // Sorting it before any operation occur

  Score.update({_id: process.env.ID}, {$push: {players: {$each: [], $sort: -1}}}, (err) => {
    if (err) throw new Error(err)
    console.log('Sorted in descending order before adding')
  })

  Score.findOne({_id: process.env.ID}, (err, players) => {
    if (err) {
      console.log(chalk.red('Sorry encountered some error please try in some time'))
    } else {
      let playersArray = players.players.sort(function (a, b) {
        return b.score - a.score
      })
      client.emit('highscores', playersArray)
    }
  })

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

      let score = result.score
      let username = result.username

      // Getting documents from databse

      Score.findOne({_id: process.env.ID}, (err, players) => {
        if (err) throw new Error(err)
        let playersArray = players.players.sort(function (a, b) {
          return b.score - a.score
        })
        let lowestScore = []
        lowestScore.push(playersArray[playersArray.length - 1].score)

        // checking if last score is less then current score
        if (score > lowestScore[0]) {
          async function remove () {
            // First removing last player
            await Score.update({_id: process.env.ID}, {$pop: {players: 1}}, (err) => {
              if (err) throw new Error(err)
              console.log('Removed last player')
            })
          }

          async function add () {
            // Then updating current player
            await Score.update({_id: process.env.ID}, {$push: {players: {score, username}}}, (err) => {
              if (err) throw new Error(err)
              console.log('Added new High score')
            })
          }

          async function update () {
            // Then again sorting it correctly
            await Score.update({_id: process.env.ID}, {$push: {players: {$each: [], $sort: -1}}}, (err) => {
              if (err) throw new Error(err)
              console.log('Sorted in descending order after adding')
            })
          }

          (async () => {
            Promise.all([remove(), add(), update()]).then(() => {
              console.log('done')
            })
          })()
        }
      })

      // Fetching top scores to database

      if (arr.length === io.sockets.adapter.rooms[val.roomName].length) {
        io.in(val.roomName).emit('score', arr)
        arr = []
      }
      // Getting event for rematch
      client.on('rematch', function (result) {
        arr = []
        client.to(val.roomName).emit('requestRematch', {message: `${result.username} requested a rematch`})
      })

      // Getting accepted requests form clients
      client.on('accepted', function (result) {
        client.to(val.roomName).emit('requestRematchaccepted', {message: `${result.username} accepted rematch press Ctrl + g`, para: result.para})
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
