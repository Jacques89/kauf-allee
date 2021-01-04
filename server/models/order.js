const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  
})

exports.Order = mongoose.model('Order', orderSchema)