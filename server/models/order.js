/**
 * order.js
 * @fileoverview The order model schema
 * @param {ObjectId} orderItems The orderItems containing the products in an order
 * @param {String} shippingAddress1 The primary shipping address of the order
 * @param {String} shippingAddress2 The secondary shipping address of the order
 * @param {String} city The city destination of the order 
 * @param {String} postcode The postcode of the shipping address 
 * @param {String} country The country destination of the shipping address
 * @param {String} phone The phone number of the order to contact the user
 * @param {String} status The current shipping status of the order
 * @param {Number} totalPrice The total price of the order
 * @param {ObjectId} user The user id of the user who made the order
 * @param {Date} dateOrdered The date that the order was made 
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true,
  }],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  }
})

orderSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

orderSchema.set('toJSON', {
  virtuals: true
})

exports.Order = mongoose.model('Order', orderSchema)