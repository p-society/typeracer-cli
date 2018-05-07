const randomNumber = require('../scripts/paragraph')
const paragraph = require('../paragraphs/para')
const io = require('socket.io-client')

describe('Suite of unit tests', function () {
  var socket
  beforeEach(function (done) {
      // Setup
    socket = io.connect('https://gaudy-cement.glitch.me/', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 2
    })

    socket.on('connect', function () {
      console.log('worked...')
      done()
    })
    socket.on('disconnect', function () {
      console.log('disconnected...')
    })
  })

  afterEach(function (done) {
    if (socket.connected) {
      console.log('disconnecting...')
      socket.disconnect()
    } else {
      console.log('no connection to break...')
    }
    done()
  })
})

describe('mandatory test', () => {
  it('messi and ronaldo', () => {
    const god = 'messi' + 'ronaldo'
    expect(god).toBe('messironaldo')
  })
})

describe('paragraph', () => {
  it('gets random number', () => {
    expect(randomNumber).toBeDefined()
  })

  it('gets random paragraph', () => {
    let para = paragraph[randomNumber].para
    expect(para).toBeDefined()
  })
})
