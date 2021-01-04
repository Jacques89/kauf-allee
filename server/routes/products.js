const express = require('express')
const router = express.Router()

const { Category } = require('../models/category')
const { Product } = require('../models/product')

router.get(`/`, async (req, res) => {
  const productList = await Product.find()

  if (!productList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(productList)
})

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

module.exports = router