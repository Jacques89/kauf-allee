/**
 * categories.js
 * @fileoverview catagories routes file in order to perform CRUD actions for catagories endpoints
 * @param {Obj} Category is the category that products belong to
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { 
  getCategories, 
  getCategoryId,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories')

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
router.get(`/`, getCategories)

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
router.get(`/:id`, getCategoryId)

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
router.post(`/`, createCategory)

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
router.put(`/:id`, updateCategory)

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
router.delete(`/:id`, deleteCategory)

module.exports = router