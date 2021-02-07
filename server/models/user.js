/**
 * user.js
 * @fileoverview The user model schema
 * @param {String} name The name of the user
 * @param {String} email The email of the user
 * @param {String} passwordHash The hashed password of the user
 * @param {String} phone The phone number of the user
 * @param {Boolean} isAdmin Determines if the user is an admin
 * @param {String} street The street of the user
 * @param {String} apartment The apartment of the user
 * @param {String} postcode The postcode of the user
 * @param {String} city The city of the user
 * @param {String} country The country of the user
 */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  postcode: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  }
})

userSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

userSchema.set('toJSON', {
  virtuals: true,
})

exports.User = mongoose.model('User', userSchema)
exports.userSchema = userSchema