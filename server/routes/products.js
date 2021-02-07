/**
 * products.js
 * @fileoverview Products routes file in order to perform CRUD actions for products endpoints
 * @param {Obj} Product is item displayed in the shop
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()
const multer = require('multer')
const mongoose = require('mongoose')

const { 
  getProducts,
  getProductId,
  getProductCount,
  getFeaturedProductCount,
  createProduct,
  updateProduct,
  updateProductImage,
  deleteProduct
} = require('../controllers/products')

// Multer config for image uploads
const FILE_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')

    if (isValid) {
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

// GET REQUESTS
router.get(`/`, getProducts)

router.get(`/:id`, getProductId)

router.get(`/get/count`, getProductCount)

router.get(`/get/featured/:count`, getFeaturedProductCount)

// POST REQUESTS
router.post(`/`, uploadOptions.single('image'), createProduct)

// PUT REQUESTS
router.put(`/:id`, updateProduct)

router.put(`/gallery/:id`, uploadOptions.array('images', 10), updateProductImage)

// DELETE REQUESTS
router.delete(`/:id`, deleteProduct)

module.exports = router