/**
 * @constructor category.js 
 * @fileoverview The category model schema
 * @param {String} name The name of the category
 * @param {String} icon The icon of the category
 * @param {String} color The color of the category
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  }
})

exports.Category = mongoose.model('Category', categorySchema)