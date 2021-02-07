/**
 * order-item.js 
 * @fileoverview The order-items model schema
 * @param {Number} quantity The quantity of the products within an order
 * @param {ObjectId} product The product within the order
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderItemSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema)