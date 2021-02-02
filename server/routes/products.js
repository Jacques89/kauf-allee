/**
 * products.js
 * @fileoverview Products routes file in order to perform CRUD actions for products endpoints
 * @param {Obj} Product is item displayed in the shop
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()


const { 
  getProducts,
  getProductId,
  getProductCount,
  getFeaturedProductCount,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products')

// GET REQUESTS
router.get(`/`, getProducts)

router.get(`/:id`, getProductId)

router.get(`/get/count`, getProductCount)

router.get(`/get/featured/:count`, getFeaturedProductCount)

// POST REQUESTS
router.post(`/`, createProduct)

// PUT REQUESTS
router.put(`/:id`, updateProduct)

// DELETE REQUESTS
router.delete(`/:id`, deleteProduct)

module.exports = router