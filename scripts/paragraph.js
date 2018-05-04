const para = require('../paragraphs/para')

// Generating a random paragraph
const random = Math.floor((Math.random() * para.length))
var quote = para[random].para
if (quote.length < 100) {
  quote = para[random].para + ' ' + para[random - 1].para
}

module.exports = quote
