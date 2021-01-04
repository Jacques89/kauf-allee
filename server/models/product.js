const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: String,
  image: String,
  stockCount: {
    type: Number,
    required: true
  }
})

exports.Product = mongoose.model('Product', productSchema)