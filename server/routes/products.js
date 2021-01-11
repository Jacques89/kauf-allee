/**
 * products.js
 * @fileoverview Products routes file in order to perform CRUD actions for products endpoints
 * @param {Obj} Product is item displayed in the shop
 * @author Jacques Nalletamby
*/
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { Category } = require('../models/category')
const { Product } = require('../models/product')

// GET REQUESTS
/**
 * @apiName GetProducts
 * @api {get} /products 
 * @apiDescription Get the Product information
 * @apiGroup Products
 * @apiSuccess {String} name The Name of the Product
 * @apiSuccess {String} description The Brief description of the product
 * @apiSuccess {String} mainDescription The Main description of the product
 * @apiSuccess {String} image The Landing image of the product
 * @apiSuccess {String[]} images The Images of the product
 * @apiSuccess {String} brand The Brand name of the product
 * @apiSuccess {Number} price The Price of the product
 * @apiSuccess {Obj} category The Category of the product
 * @apiSuccess {Number} stockCount The Stock Count of the product
 * @apiSuccess {Number} rating The Rating of the product
 * @apiSuccess {Number} numReviews The number of reviews of the product
 * @apiSuccess {String} id The id of the product
 * @apiSuccess {Boolean} isFeatured The boolean value if the product is on the landing page 
 * @apiSuccess {Date} dateCreated The date the product was created
 * @apiError ProductsNotFound (500) The products could not be retrieved
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
 * @apiName GetProductID 
 * @api {get} /products/:id 
 * @apiDescription Get the Product Id
 * @apiParam {String} id String value of the productID
 * @apiGroup Products
 * @apiSuccess {String} name Name of the Product
 * @apiSuccess {String} description Brief description of the product
 * @apiSuccess {String} mainDescription Main description of the product
 * @apiSuccess {String} image Landing image of the product
 * @apiSuccess {String[]} images Images of the product
 * @apiSuccess {String} brand Brand name of the product
 * @apiSuccess {Number} price Price of the product
 * @apiSuccess {ObjId} category Category of the product
 * @apiError ProductNotFound (500) The product could not be found
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
 * @apiName GetProductCount
 * @api {get} /get/count 
 * @apiDescription Get the product quantity in the database
 * @apiParam {Number} count is the quantity of products retrieved from the request.
 * @apiGroup Products
 * @apiSuccess {Number} productCount The quantity of overall products
 * @apiError ProductCountNotFound (500) The product count could not be retrieved
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
 * @apiName GetFeaturedProduct
 * @api {get} /get/featured/:count 
 * @apiDescription Get the featured quantity in the database
 * @apiParam {Number} Count is the quantity of featured products retrieved from the request.
 * @apiGroup Products
 * @apiSuccess {Number} productCount The quantity of overall products
 * @apiError ProductCountNotFound (500) The products could not be retrieved
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
 * @apiName PostProduct
 * @api {post} /products 
 * @apiDescription Create a new product
 * @apiParam {Number} count is the quantity of products retrieved from the request.
 * @apiGroup Products
 * @apiSuccess {String} name The Name of the Product
 * @apiSuccess {String} description The Brief description of the product
 * @apiSuccess {String} mainDescription The Main description of the product
 * @apiSuccess {String} image The Landing image of the product
 * @apiSuccess {String[]} images The Images of the product
 * @apiSuccess {String} brand The Brand name of the product
 * @apiSuccess {Number} price The Price of the product
 * @apiSuccess {Obj} category The Category of the product
 * @apiSuccess {Number} stockCount The Stock Count of the product
 * @apiSuccess {Number} rating The Rating of the product
 * @apiSuccess {Number} numReviews The number of reviews of the product
 * @apiSuccess {String} id The id of the product
 * @apiSuccess {Boolean} isFeatured The boolean value if the product is on the landing page 
 * @apiSuccess {Date} dateCreated The date the product was created
 * @apiError InvalidCategory (400) The category was not valid
 * @apiError ProductCountNotFound (500) The product could not be created
*/
router.post(`/`, async(req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) {
    return res.status(400).send('Invalid Category')
  }

  let product = new Product({
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
 * @apiName UpdateProduct
 * @api {put} /products/:id 
 * @apiDescription Update an existing product
 * @apiParam {Number} count is the quantity of products retrieved from the request.
 * @apiGroup Products
 * @apiSuccess {String} name The Name of the Product
 * @apiSuccess {String} description The Brief description of the product
 * @apiSuccess {String} mainDescription The Main description of the product
 * @apiSuccess {String} image The Landing image of the product
 * @apiSuccess {String[]} images The Images of the product
 * @apiSuccess {String} brand The Brand name of the product
 * @apiSuccess {Number} price The Price of the product
 * @apiSuccess {Obj} category The Category of the product
 * @apiSuccess {Number} stockCount The Stock Count of the product
 * @apiSuccess {Number} rating The Rating of the product
 * @apiSuccess {Number} numReviews The number of reviews of the product
 * @apiSuccess {String} id The id of the product
 * @apiSuccess {Boolean} isFeatured The boolean value if the product is on the landing page 
 * @apiSuccess {Date} dateCreated The date the product was created
 * @apiError InvalidProductId (400) The product Id was not valid
 * @apiError InvalidCategory (400) The category was not valid
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
 * @apiName DeleteProduct
 * @api {delete} /products/:id
 * @apiDescription Delete an existing product
 * @apiParam {String} id The id of the product
 * @apiGroup Products
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