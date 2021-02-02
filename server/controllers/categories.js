/**
 * categories.js
 * @fileoverview Category routes file in order to perform CRUD actions for users endpoints
 * @param {Obj} Category 
 * @author Jacques Nalletamby
 */

const { Category } = require('../models/category')

/**
 * GET CONTROLLERS
 */

 /**
 * @apiName GetCategory
 * @api {get} /categories
 * @apiDescription Get the Categories information
 * @apiGroup Categories 
 * @apiPermission none
 * @apiSuccess {String} id The id of the Category
 * @apiSuccess {String} name The name of the Category
 * @apiSuccess {String} icon The Icon of the Category
 * @apiSuccess {String} color The color of the Category
 * @apiError CategoriesNotFound (500) The Categories could not be retrieved
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

/**
 * @apiName GetCategoryId
 * @api {get} /categories/:id
 * @apiDescription Get a specific Category
 * @apiParam {String} id String value of the Category ID
 * @apiGroup Categories 
 * @apiPermission none
 * @apiSuccess {String} id The id of the Category
 * @apiSuccess {String} name The name of the Category
 * @apiSuccess {String} icon The Icon of the Category
 * @apiSuccess {String} color The color of the Category TODO BETTER DESCRIPTION
 * @apiError CategoryNotFound (500) The Category could not be retrieved
 */
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

 /**
 * @apiName PostCategory
 * @api {post} /categories
 * @apiDescription Create a new Category
 * @apiGroup Categories 
 * @apiPermission admin
 * @apiSuccess {String} id The id of the Category
 * @apiSuccess {String} name The name of the Category
 * @apiSuccess {String} icon The Icon of the Category
 * @apiSuccess {String} color The color of the Category TODO BETTER DESCRIPTION
 * @apiError CategoryNotCreated(404) The Category cannot be created!
 * @apiError NoAccessRights (401) User is not authorized
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

 /**
 * @apiName UpdateCategory
 * @api {put} /categories/:id
 * @apiDescription Update an existing Category
 * @apiParam {String} id String value of the Category ID
 * @apiGroup Categories 
 * @apiPermission admin
 * @apiSuccess {String} id The id of the Category
 * @apiSuccess {String} name The name of the Category
 * @apiSuccess {String} icon The Icon of the Category
 * @apiSuccess {String} color The color of the Category
 * @apiError CategoryNotUpdated (404) The Category cannot be updated
 * @apiError NoAccessRights (401) User is not authorized
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

 /**
 * @apiName DeleteCategory
 * @api {delete} /categories/:id
 * @apiDescription Delete an existing Category
 * @apiParam {String} id String value of the category ID
 * @apiGroup Categories 
 * @apiPermission admin
 * @apiError CategoryNotDeleted (404) The Category could not be deleted
 * @apiError NoAccessRights (401) User is not authorized
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
