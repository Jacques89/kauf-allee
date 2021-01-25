const { Product } = require('../models/product')
const { Category } = require('../models/category')

/**
 * GET CONTROLLERS
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

exports.getProductId = async(req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(500).json({
      message: 'Product ID was not found',
    })
  }
  res.status(200).send(product)
}

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
exports.createProduct = async(req, res) => {
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
}

/**
 * PUT CONTROLLERS
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

/**
 * DELETE CONTROLLERS
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