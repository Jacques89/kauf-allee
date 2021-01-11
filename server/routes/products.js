/**
 * products.js
 * @fileoverview Products routes file in order to perform CRUD actions for products endpoints
 * @param {Obj} product is item displayed in the shop
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { Category } = require('../models/category')
const { Product } = require('../models/product')

/**
 * @api get /products Get Products information 
 * @apiName GetProducts
 * @apiGroup Products
 */
router.get(`/`, async (req, res) => {
  let filter = {}

  if (req.query.catagories) {
    filter = {category: req.query.catagories.split(',')}
  }

  const productList = await Product.find(filter).populate('category')

  if (!productList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(productList)
})

/**
 * 
 * @param {String} id is the String value of the productID
 * @param req
 * @param res
 */
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')

  if (!product) {
    res.status(500).json({
      success: false
    })
  }
  res.send(product)
})

/**
 * @param req
 * @param res
 * @param count is the quantity of documents retrieved from the request.
 */
router.get(`/get/count`, async(req, res) => {
  const productCount = await Product.countDocuments(count => count)

  if (!productCount) {
    res.status(500).json({
      success: false
    })
  }
  res.send({
    productCount: productCount
  })
})
/**
 *   
 * @param req
 * @param res
 * @param count is the quantity of documents retrieved from the request.
*/
router.get(`/get/featured/:count`, async(req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({
    isFeatured: true
  })
  .limit(+count)

  if (!products) {
    res.status(500).json({
      success: false
    })
  }
  res.send(products)
})

// POST REQUESTS
/**
 * @param body is the request body parsed by bodyParser middleware
 * @param req
 * @param res
 */
router.post(`/`, async(req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) {
    return res.status(400).send('Invalid Category')
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    mainDescription: req.body.mainDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    stockCount: req.body.stockCount,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured
  })
  product = await product.save()

  if (!product) {
    return res.status(500).send('Product could not be created')
  }
  res.send(product)
})

// PUT REQUESTS
/**
 * @param {String} id is the string value of the ProductID
 */
router.put(`/:id`, async(req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid Product Id')
  }

  const category = await Category.findById(req.body.category)

  if (!category) {
    return res.status(400).send('Invalid Category')
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      mainDescription: req.body.mainDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      stockCount: req.body.stockCount,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  )
  if (!product) {
    return res.status(500).send('Product cannot be updated!')
  }
  res.send(product)
})

/**
 * DELETE REQUESTS
 * @param {number} id is the objectId of the product
 * @param req 
 * @param res
 */

router.delete(`/:id`, (req, res) => {
  Product.findByIdAndRemove(req.params.id)
  .then(product => {
    if (product) {
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully!'
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'Product could not be deleted!'
      })
    }
  })
  .catch(err => {
    return res.status(400).json({
      success: false,
      error: err
    })
  })
})

module.exports = router