/**
 * products.js
 * @fileoverview Products routes file in order to perform CRUD actions for products endpoints
 * @param {Obj} Product is item displayed in the shop
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

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
/**
 * @apiName GetProducts
 * @api {get} /products 
 * @apiDescription Get the Product information
 * @apiGroup Products
 * @apiPermission none
 * @apiSuccess {String} name The Name of the product
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
router.get(`/`, getProducts)

/**
 * @apiName GetProductID 
 * @api {get} /products/:id 
 * @apiDescription Get the Product Id
 * @apiParam {String} id String value of the product ID
 * @apiGroup Products
 * @apiPermission none
 * @apiSuccess {String} name Name of the Product
 * @apiSuccess {String} description Brief description of the Product
 * @apiSuccess {String} mainDescription Main description of the Product
 * @apiSuccess {String} image Landing image of the Product
 * @apiSuccess {String[]} images Images of the Product
 * @apiSuccess {String} brand Brand name of the Product
 * @apiSuccess {Number} price Price of the Product
 * @apiSuccess {ObjId} category Category of the Product
 * @apiError ProductNotFound (500) The Product could not be found
 */
router.get(`/:id`, getProductId)

/**
 * @apiName GetProductCount
 * @api {get} /get/count 
 * @apiDescription Get the Product quantity in the database
 * @apiGroup Products
 * @apiPermission admin
 * @apiSuccess {Number} productCount The quantity of overall Products
 * @apiError ProductCountNotFound (500) The Product count could not be retrieved
 */
router.get(`/get/count`, getProductCount)

/**
 * @apiName GetFeaturedProduct
 * @api {get} /get/featured/:count 
 * @apiDescription Get the featured quantity in the database
 * @apiParam {Number} Count is the quantity of featured Products retrieved from the request.
 * @apiGroup Products
 * @apiPermission none
 * @apiSuccess {Number} productCount The quantity of overall Products
 * @apiError ProductCountNotFound (500) The Products could not be retrieved
*/
router.get(`/get/featured/:count`, getFeaturedProductCount)

// POST REQUESTS
/**
 * @apiName PostProduct
 * @api {post} /products 
 * @apiDescription Create a new Product
 * @apiParam {Number} count is the quantity of Products retrieved from the request.
 * @apiGroup Products
 * @apiPermission admin
 * @apiSuccess {String} name The Name of the Product
 * @apiSuccess {String} description The Brief description of the Product
 * @apiSuccess {String} mainDescription The Main description of the Product
 * @apiSuccess {String} image The Landing image of the Product
 * @apiSuccess {String[]} images The Images of the Product
 * @apiSuccess {String} brand The Brand name of the Product
 * @apiSuccess {Number} price The Price of the Product
 * @apiSuccess {Obj} category The Category of the Product
 * @apiSuccess {Number} stockCount The Stock Count of the Product
 * @apiSuccess {Number} rating The Rating of the Product
 * @apiSuccess {Number} numReviews The number of reviews of the Product
 * @apiSuccess {String} id The id of the Product
 * @apiSuccess {Boolean} isFeatured The boolean value if the Product is on the landing page 
 * @apiSuccess {Date} dateCreated The date the Product was created
 * @apiError InvalidCategory (400) The Category was not valid
 * @apiError ProductNotFound (500) The Product could not be created
 * @apiError NoAccessRights (401) User is not authorized
 */
router.post(`/`, createProduct)

// PUT REQUESTS
/**
 * @apiName UpdateProduct
 * @api {put} /products/:id 
 * @apiDescription Update an existing Product
 * @apiParam {Number} count is the quantity of Products retrieved from the request.
 * @apiGroup Products
 * @apiPermission admin
 * @apiSuccess {String} name The Name of the Product
 * @apiSuccess {String} description The brief description of the Product
 * @apiSuccess {String} mainDescription The Main description of the Product
 * @apiSuccess {String} image The Landing image of the Product
 * @apiSuccess {String[]} images The Images of the Product
 * @apiSuccess {String} brand The Brand name of the Product
 * @apiSuccess {Number} price The Price of the Product
 * @apiSuccess {Obj} category The Category of the Product
 * @apiSuccess {Number} stockCount The Stock Count of the Product
 * @apiSuccess {Number} rating The Rating of the Product
 * @apiSuccess {Number} numReviews The number of reviews of the Product
 * @apiSuccess {String} id The id of the Product
 * @apiSuccess {Boolean} isFeatured The boolean value if the Product is on the landing page 
 * @apiSuccess {Date} dateCreated The date the Product was created
 * @apiError InvalidProductId (400) The Product Id was not valid
 * @apiError InvalidCategory (400) The Category was not valid
 * @apiError NoAccessRights (401) User is not authorized
 */
router.put(`/:id`, updateProduct)

// DELETE REQUESTS
/**
 * @apiName DeleteProduct
 * @api {delete} /products/:id
 * @apiDescription Delete an existing Product
 * @apiParam {String} id The id of the Product
 * @apiGroup Products
 * @apiPermission admin
 */
router.delete(`/:id`, deleteProduct)

module.exports = router