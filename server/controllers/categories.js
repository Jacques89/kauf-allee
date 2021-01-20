const { Category } = require('../models/category')

/**
 * GET CONTROLLERS
 */
exports.getCategories = async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({
      success: false,
    })
  }
  res.status(200).send(categoryList)
}

exports.getCategoryId = async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(500).json({
      message: 'Category ID was not found',
    })
  }
  res.status(200).send(category)
}

/**
 * POST CONTROLLERS
 */
exports.createCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  })
  category = await category.save()

  if (!category) {
    return res.status(404).send('Category cannot be created!')
  }
  res.send(category)
}

/**
 * PUT CONTROLLERS
 */
exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon || category.icon,
      color: req.body.color,
    },
    { new: true },
  )
  if (!category) {
    return res.status(404).send('Category cannot be updated!')
  }
  res.send(category)
}

/**
 * DELETE CONTROLLERS
 */
exports.deleteCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: 'Category deleted successfully!',
        })
      }
      return res.status(404).json({
        success: false,
        message: 'Category could not be deleted!',
      })
    })
    .catch((err) => res.status(400).json({
      success: false,
      error: err,
    }))
}
