/**
 * product.js
 * @fileoverview The product model schema
 * @param {String} name The name of the product
 * @param {String} description The description of the product
 * @param {String} mainDescription The more detailed description of the product
 * @param {String} image The image of the product
 * @param {String[]} images The images of the product
 * @param {String} brand The brand of the product
 * @param {Number} price The price of the product
 * @param {ObjectId} category The category id of which the product belongs to
 * @param {Number} stockCount The total quantity of the product
 * @param {Number} rating The user ratings of the product
 * @param {Number} numReviews The number of user reviews of the product 
 * @param {Boolean} isFeatured Determines if the product is featured on the main page
 * @param {Date} dateCreated The date that the product was made
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mainDescription: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stockCount: {
    type: Number,
    required: true,
    min: 0,
    max: 250,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
})

productSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

productSchema.set('toJSON', {
  virtuals: true
})

exports.Product = mongoose.model('Product', productSchema)