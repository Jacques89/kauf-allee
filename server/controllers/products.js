/**
 * products.js
 * @fileoverview Products controllers file for logic of the product crud
 * @param {Obj} Product is item displayed in the shop
 * @author Jacques Nalletamby
 */

const mongoose = require('mongoose')
const multer = require('multer')

const { Product } = require('../models/product')
const { Category } = require('../models/category')

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

/**
 * GET CONTROLLERS
 */

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
exports.getProducts = async(req, res) => {
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
}

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
exports.getProductId = async(req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(500).json({
      message: 'Product ID was not found',
    })
  }
  res.status(200).send(product)
}

/**
 * @apiName GetProductCount
 * @api {get} /get/count 
 * @apiDescription Get the Product quantity in the database
 * @apiGroup Products
 * @apiPermission admin
 * @apiSuccess {Number} productCount The quantity of overall Products
 * @apiError ProductCountNotFound (500) The Product count could not be retrieved
 */
exports.getProductCount = async(req, res) => {
  const productCount = await Product.countDocuments(count => count)

  if (!productCount) {
    res.status(500).json({
      success: false
    })
  }
  res.send({
    productCount: productCount
  })
}

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
exports.getFeaturedProductCount = async(req, res) => {
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
}

/**
 * POST CONTROLLERS
 */

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
exports.createProduct = async(req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) {
    return res.status(400).send('Invalid Category')
  }

  uploadOptions.single('image')

  const file = req.file
  if (!file) {
    return res.status(400).send('No file in the request')
  }

  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    mainDescription: req.body.mainDescription,
    image: `${basePath}${fileName}`,
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
}

/**
 * PUT CONTROLLERS
 */

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
exports.updateProduct = async(req, res) => {
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
}

exports.updateProductImage = async(req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id')
  }
  
  const files = req.files
  let imagesPaths = []
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

  if(files) {
    files.map(file =>{
      imagesPaths.push(`${basePath}${file.filename}`)
    })
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesPaths
    },
    { new: true}
  )

  if(!product)
    return res.status(500).send('the gallery cannot be updated!')

  res.send(product)
}

/**
 * DELETE CONTROLLERS
 */

 /**
 * @apiName DeleteProduct
 * @api {delete} /products/:id
 * @apiDescription Delete an existing Product
 * @apiParam {String} id The id of the Product
 * @apiGroup Products
 * @apiPermission admin
 */
exports.deleteProduct = async(req, res) => {
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
}