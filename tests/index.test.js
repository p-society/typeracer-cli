const randomNumber = require('../scripts/paragraph')
const paragraph = require('../paragraphs/para')
const io = require('socket.io-client')
// const fs = require('fs')

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

  it('checks same paragraph', () => {
    var valueArr = paragraph.map(function (item) { return item.para })
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx
    })
    if (isDuplicate === true) {
      throw new Error('Please check paragraphs you added. It seems that they are already present in para.json file')
    }
    expect(isDuplicate).toBe(false)
  })

/**
* To remove redundancy and write new paragraphs

it('convert to unique paragraph', () => {
  var repeats = []
  var item
  var i = 0

  while (i < paragraph.length) {
    repeats.indexOf(item = paragraph[i++].para) > -1 ? paragraph.pop(i--) : repeats.push(item)
  }
  let newPara = JSON.stringify(paragraph, null, ' ')
  fs.writeFile('./paragraphs/para.json', newPara, (err) => {
    console.log('done')
  })
})

*/
})
