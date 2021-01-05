const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { Category } = require('../models/category')
const { Product } = require('../models/product')

router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate('category')

  if (!productList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(productList)
})

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')

  if (!product) {
    res.status(500).json({
      success: false
    })
  }
  res.send(product)
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