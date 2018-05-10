var mongoose = require('mongoose')
var Schema = mongoose.Schema

var scoreSchema = new Schema({
  players : {
    type : Array
  }
})

module.exports = mongoose.model('score',scoreSchema)
