const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  image: String,
  stockCount: {
    type: Number,
    required: true
  }
})

exports.User = mongoose.model('User', userSchema)