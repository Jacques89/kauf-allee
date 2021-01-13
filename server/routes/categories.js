/**
 * categories.js
 * @fileoverview catagories routes file in order to perform CRUD actions for catagories endpoints
 * @param {Obj} Category is the category that products belong to
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { Category } = require('../models/category')

// GET REQUESTS
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
router.get(`/`, async(req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(categoryList)
})

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
router.get(`/:id`, async(req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(500).json({
      message: `Category ID was not found`
    })
  }
  res.status(200).send(category)
})

// POST REQUESTS
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
router.post(`/`, async(req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  category = await category.save()

  if (!category) {
    return res.status(404).send('Category cannot be created!')
  }
  res.send(category)
})

// PUT REQUESTS
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
router.put(`/:id`, async(req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon || category.icon,
      color: req.body.color,
    },
    { new: true }
  )
  if (!category) {
    return res.status(404).send('Category cannot be updated!')
  }
  res.send(category)
})

// DELETE REQUESTS
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
router.delete(`/:id`, (req, res) => {
  Category.findByIdAndRemove(req.params.id)
  .then(category => {
    if (category) {
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully!'
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'Category could not be deleted!'
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